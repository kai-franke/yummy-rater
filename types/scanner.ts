export interface ScannerProps {
  onScan: (data: string) => void;
  onStartScanning?: () => void;
}
