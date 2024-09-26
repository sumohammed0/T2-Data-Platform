import argparse
import csv
from datetime import datetime, timedelta
import random
import string

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
    parser = argparse.ArgumentParser(description="Generate a CSV file with time series data.")
    parser.add_argument('filename', help="Output CSV filename")
    parser.add_argument('--start', required=True, help="Start date (YYYY-MM-DD HH:MM)")
    parser.add_argument('--end', required=True, help="End date (YYYY-MM-DD HH:MM)")
    parser.add_argument('--interval', type=int, default=60, help="Time interval in minutes (default: 60)")
    parser.add_argument('--columns', required=True, help="Column specifications (name:type,name:type,...)")
    
    args = parser.parse_args()
    
    start_date = datetime.strptime(args.start, "%Y-%m-%d %H:%M")
    end_date = datetime.strptime(args.end, "%Y-%m-%d %H:%M")
    
    columns = [{'name': col.split(':')[0], 'type': col.split(':')[1]} for col in args.columns.split(',')]
    
    generate_csv(args.filename, start_date, end_date, args.interval, columns)
    print(f"CSV file '{args.filename}' generated successfully.")

if __name__ == "__main__":
    main()