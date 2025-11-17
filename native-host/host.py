#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Native Messaging Host for WebM to MP4 Converter
Handles communication between Firefox extension and FFmpeg
"""

import sys
import json
import struct
import subprocess
import os
import logging
from pathlib import Path

# Setup logging to file (since stdout is used for native messaging)
logging.basicConfig(
    filename=os.path.join(os.path.dirname(__file__), 'host.log'),
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def get_message():
    """
    Read a message from stdin (sent by the extension).
    Messages are sent in Native Messaging format:
    - First 4 bytes: message length (uint32)
    - Following bytes: JSON message
    """
    try:
        # Read message length (4 bytes)
        raw_length = sys.stdin.buffer.read(4)
        if not raw_length:
            logging.info("No message received, stdin closed")
            sys.exit(0)

        # Unpack message length
        message_length = struct.unpack('=I', raw_length)[0]
        logging.debug(f"Receiving message of length: {message_length}")

        # Read the message
        message = sys.stdin.buffer.read(message_length).decode('utf-8')
        logging.debug(f"Received message: {message}")

        return json.loads(message)
    except Exception as e:
        logging.error(f"Error reading message: {e}")
        return None

def send_message(message):
    """
    Send a message to stdout (to the extension).
    Messages must be sent in Native Messaging format.
    """
    try:
        encoded_message = json.dumps(message).encode('utf-8')
        encoded_length = struct.pack('=I', len(encoded_message))

        sys.stdout.buffer.write(encoded_length)
        sys.stdout.buffer.write(encoded_message)
        sys.stdout.buffer.flush()

        logging.debug(f"Sent message: {message}")
    except Exception as e:
        logging.error(f"Error sending message: {e}")

def check_ffmpeg():
    """
    Check if FFmpeg is available on the system.
    """
    try:
        result = subprocess.run(
            ['ffmpeg', '-version'],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            version_line = result.stdout.split('\n')[0]
            logging.info(f"FFmpeg found: {version_line}")
            return {
                'available': True,
                'version': version_line
            }
    except FileNotFoundError:
        logging.warning("FFmpeg not found in PATH")
    except Exception as e:
        logging.error(f"Error checking FFmpeg: {e}")

    return {
        'available': False,
        'error': 'FFmpeg not found'
    }

def convert_webm_to_mp4(input_path, output_path=None):
    """
    Convert a WebM file to MP4 using FFmpeg.

    Args:
        input_path: Path to input .webm file
        output_path: Path to output .mp4 file (optional, defaults to same name with .mp4)

    Returns:
        dict: Status of the conversion
    """
    try:
        # Validate input file
        input_file = Path(input_path)
        if not input_file.exists():
            return {
                'success': False,
                'error': f'Input file not found: {input_path}'
            }

        # Generate output path if not provided
        if output_path is None:
            output_path = str(input_file.with_suffix('.mp4'))

        # Handle filename conflicts (if file exists, add number)
        output_file = Path(output_path)
        if output_file.exists():
            base = output_file.stem
            ext = output_file.suffix
            parent = output_file.parent
            counter = 1

            while output_file.exists():
                output_path = str(parent / f"{base} ({counter}){ext}")
                output_file = Path(output_path)
                counter += 1

            logging.info(f"Output file exists, using: {output_path}")

        logging.info(f"Starting conversion: {input_path} -> {output_path}")

        # FFmpeg command optimized for quality and speed
        # -c:v libx264: H.264 video codec
        # -preset fast: encoding speed preset
        # -crf 22: quality (18-28, lower = better quality)
        # -c:a aac: AAC audio codec
        # -b:a 192k: audio bitrate
        ffmpeg_command = [
            'ffmpeg',
            '-i', str(input_path),
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '22',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-y',  # Overwrite output file if exists
            str(output_path)
        ]

        # Run FFmpeg
        result = subprocess.run(
            ffmpeg_command,
            capture_output=True,
            text=True,
            timeout=300  # 5 minutes timeout
        )

        if result.returncode == 0:
            logging.info(f"Conversion successful: {output_path}")

            # Delete original .webm file after successful conversion
            try:
                input_file.unlink()
                logging.info(f"Deleted original file: {input_path}")
                deleted_original = True
            except Exception as e:
                logging.warning(f"Could not delete original file: {e}")
                deleted_original = False

            return {
                'success': True,
                'output_path': str(output_path),
                'input_path': str(input_path),
                'deleted_original': deleted_original,
                'message': 'Conversion completed successfully'
            }
        else:
            logging.error(f"FFmpeg error: {result.stderr}")
            return {
                'success': False,
                'error': f'FFmpeg conversion failed: {result.stderr[:500]}'
            }

    except subprocess.TimeoutExpired:
        logging.error("FFmpeg conversion timed out")
        return {
            'success': False,
            'error': 'Conversion timed out (max 5 minutes)'
        }
    except Exception as e:
        logging.error(f"Conversion error: {e}")
        return {
            'success': False,
            'error': str(e)
        }

def handle_message(message):
    """
    Handle incoming messages from the extension.

    Supported actions:
    - ping: Test connection
    - check_ffmpeg: Check FFmpeg availability
    - convert: Convert WebM to MP4
    """
    if not message:
        return {'error': 'Invalid message'}

    action = message.get('action')
    logging.info(f"Handling action: {action}")

    if action == 'ping':
        return {
            'action': 'pong',
            'message': 'Native host is responding',
            'version': '0.1.0'
        }

    elif action == 'check_ffmpeg':
        return {
            'action': 'ffmpeg_status',
            **check_ffmpeg()
        }

    elif action == 'convert':
        input_path = message.get('input_path')
        output_path = message.get('output_path')

        if not input_path:
            return {
                'action': 'convert_result',
                'success': False,
                'error': 'Missing input_path parameter'
            }

        result = convert_webm_to_mp4(input_path, output_path)
        return {
            'action': 'convert_result',
            **result
        }

    else:
        return {
            'error': f'Unknown action: {action}'
        }

def main():
    """
    Main loop: read messages from extension and respond.
    """
    logging.info("Native host started")

    try:
        while True:
            message = get_message()
            if message is None:
                break

            response = handle_message(message)
            send_message(response)

    except KeyboardInterrupt:
        logging.info("Native host interrupted")
    except Exception as e:
        logging.error(f"Fatal error: {e}")
    finally:
        logging.info("Native host stopped")

if __name__ == '__main__':
    main()
