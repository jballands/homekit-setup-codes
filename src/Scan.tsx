import type { ChangeEvent } from 'react';

import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, parseSetupUri } from './qrCodeHelpers';
import { useHomeKitData } from './HomeKitDataContext';
import './Scan.css';

function Scan() {
	const { setHomeKitData } = useHomeKitData();

	const [setupUri, setSetupUri] = useState('');
	const [isScanning, setIsScanning] = useState(false);

	const videoRef = useRef<HTMLVideoElement>(null);
	const qrScannerRef = useRef<QrScanner | null>(null);

	useEffect(() => {
		const maybeData = parseSetupUri(setupUri);

		if (maybeData) {
			const data = maybeData;

			// Find the category name from the category ID
			const categoryName = Object.keys(CATEGORIES).find(
				key => CATEGORIES[key as keyof typeof CATEGORIES] === data.categoryId
			);

			// Set data in context
			setHomeKitData({ ...data, category: categoryName });
		}
	}, [setHomeKitData, setupUri]);

	const handleSetupUriChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSetupUri(event.target.value);
	};

	const stopScanning = () => {
		setIsScanning(false);
		qrScannerRef.current?.stop();
	};

	const handleToggleScan = async () => {
		if (isScanning) {
			stopScanning();
			return;
		}

		if (!videoRef.current) {
			throw new Error('No video element rendered!!');
		}

		try {
			setIsScanning(true);

			await qrScannerRef.current?.start();
		} catch (error) {
			console.error('Error starting QR scanner:', error);
			setIsScanning(false);
		}
	};

	// Set up the QRScanner
	useEffect(() => {
		if (!videoRef.current) {
			return;
		}

		qrScannerRef.current = new QrScanner(
			videoRef.current,
			result => {
				stopScanning();
				setSetupUri(result.data);
			},
			{
				returnDetailedScanResult: true,
				highlightScanRegion: true,
				highlightCodeOutline: true,
			}
		);

		return () => {
			if (qrScannerRef.current) {
				qrScannerRef.current.stop();
				qrScannerRef.current.destroy();
			}
		};
	}, []);

	return (
		<div className="input-group">
			<label htmlFor="scan-input">Scan HomeKit Setup Code</label>
			<div className="scan-description">
				Choose "Start Scanning" to scan a HomeKit setup code, or type the
				HomeKit URI manually.
			</div>
			<div className="scan-controls">
				<input
					id="scan-input"
					type="text"
					value={setupUri}
					onChange={handleSetupUriChange}
					placeholder="X-HM://0081YCYEP3QYT"
					className="form-input scan-input"
				/>
				<button
					type="button"
					onClick={handleToggleScan}
					className={`scan-button ${isScanning ? 'scanning' : ''}`}
				>
					{isScanning ? 'Stop Scanning' : 'Start Scanning'}
				</button>
			</div>

			<div className="video-container">
				<video
					ref={videoRef}
					className={`scan-video ${isScanning ? 'active' : ''}`}
					autoPlay
					playsInline
				/>
			</div>
		</div>
	);
}

export default Scan;
