export interface ScannerProps {
  /**
   * Callback function that is called when a barcode is successfully scanned.
   */
  onScan: (data: string) => void;
  /**
   * Optional callback function that is called when the scan process is started (for example, to reset the previously scanned data)
   */
  onStartScanning?: () => void;

  isScanning: boolean;
}
