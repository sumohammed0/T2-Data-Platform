import argparse
import csv
from datetime import datetime, timedelta
import random
import string

#SAMPLE COMMAND TO RUN: python generate_csv.py 5g_core_data.csv --start "2023-01-01 00:00" --end "2023-01-02 00:00" --interval 30

def generate_random_data(data_type):
    if data_type == 'int':
        return random.randint(0, 1000)
    elif data_type == 'string':
        return ''.join(random.choices(string.ascii_letters, k=5))
    else:
        raise ValueError(f"Unsupported data type: {data_type}")

def generate_csv(filename, start_date, end_date, interval, columns):
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        
        # Write header
        writer.writerow(['datetime'] + [col['name'] for col in columns])
        
        # Generate data
        current_date = start_date
        while current_date <= end_date:
            row = [current_date.isoformat()]
            for col in columns:
                row.append(generate_random_data(col['type']))
            writer.writerow(row)
            current_date += timedelta(minutes=interval)
def main():
    print("GENERATING DATA")
    parser = argparse.ArgumentParser(description="Generate a CSV file with 5G core network data.")
    parser.add_argument('filename', help="Output CSV filename")
    parser.add_argument('--start', required=True, help="Start date (YYYY-MM-DD HH:MM)")
    parser.add_argument('--end', required=True, help="End date (YYYY-MM-DD HH:MM)")
    parser.add_argument('--interval', type=int, default=5, help="Time interval in minutes (default: 5)")
    
    args = parser.parse_args()
    
    start_date = datetime.strptime(args.start, "%Y-%m-%d %H:%M")
    end_date = datetime.strptime(args.end, "%Y-%m-%d %H:%M")
    
    # Define 5G core network-related columns
    columns = [
        {'name': 'session_id', 'type': 'string'},
        {'name': 'user_equipment_id', 'type': 'string'},
        {'name': 'amf_instance_id', 'type': 'string'},
        {'name': 'smf_instance_id', 'type': 'string'},
        {'name': 'upf_instance_id', 'type': 'string'},
        {'name': 'number_of_active_bearers', 'type': 'int'},
        {'name': 'data_volume_uplink_mb', 'type': 'int'},
        {'name': 'data_volume_downlink_mb', 'type': 'int'},
        {'name': 'latency_ms', 'type': 'int'},
        {'name': 'packet_loss_rate', 'type': 'int'},
        {'name': 'connection_failures', 'type': 'int'},
        {'name': 'handover_attempts', 'type': 'int'},
        {'name': 'handover_successes', 'type': 'int'},
        {'name': 'signaling_traffic_volume_kb', 'type': 'int'},
    ]
    
    generate_csv(args.filename, start_date, end_date, args.interval, columns)
    print(f"CSV file '{args.filename}' with 5G core network data generated successfully.")

if __name__ == "__main__":
    main()