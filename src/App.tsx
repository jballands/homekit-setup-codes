import { useState } from 'react';
import './App.css';
import {
	CATEGORIES,
	composeQrCode,
	composeSetupUri,
	// parseSetupUri,
} from './qrCodeHelpers';
import { HOMEKIT_CATEGORIES } from './homekitCategories';

import Scan from './Scan';
import { HomeKitDataContextProvider } from './HomeKitDataContext';

function App() {
	const [setupCode, setSetupCode] = useState<string | undefined>(undefined);
	const [category, setCategory] = useState<string | undefined>(undefined);
	const [flag, setFlag] = useState<number | undefined>(2);
	const [setupId, setSetupId] = useState<string>('');
	const [qrCodeSvg, setQrCodeSvg] = useState<string | undefined>(undefined);

	// Cleanup on unmount

	const handleSetupCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, '');
		setSetupCode(value);
	};

	// const handleScanInputChange = async (
	// 	e: React.ChangeEvent<HTMLInputElement>
	// ) => {
	// 	const value = e.target.value.trim();
	// 	setScanInput(value);

	// 	if (value) {
	// 		const parsed = parseSetupUri(value);
	// 		if (parsed) {
	// 			// Find the category name from the category ID
	// 			const categoryName = Object.keys(CATEGORIES).find(
	// 				key =>
	// 					CATEGORIES[key as keyof typeof CATEGORIES] === parsed.categoryId
	// 			);

	// 			setSetupCode(parsed.password);
	// 			setCategory(categoryName);
	// 			setFlag(parsed.flag);
	// 			setSetupId(parsed.setupId);

	// 			// Auto-generate QR code
	// 			if (categoryName) {
	// 				try {
	// 					const svg = await composeQrCode({
	// 						pairingCode: parsed.password,
	// 						setupUri: value,
	// 					});
	// 					setQrCodeSvg(svg);
	// 				} catch (error) {
	// 					console.error('Error generating QR code:', error);
	// 				}
	// 			}
	// 		}
	// 	} else {
	// 		// Clear all fields when scan input is cleared
	// 		setSetupCode(undefined);
	// 		setCategory(undefined);
	// 		setFlag(2);
	// 		setSetupId('');
	// 		setQrCodeSvg(undefined);
	// 	}
	// };

	// const handleScanResult = async (result: string) => {
	// 	setScanInput(result);

	// 	const parsed = parseSetupUri(result);

	// 	if (parsed) {
	// 		// Find the category name from the category ID
	// 		const categoryName = Object.keys(CATEGORIES).find(
	// 			key => CATEGORIES[key as keyof typeof CATEGORIES] === parsed.categoryId
	// 		);

	// 		setSetupCode(parsed.password);
	// 		setCategory(categoryName);
	// 		setFlag(parsed.flag);
	// 		setSetupId(parsed.setupId);

	// 		// Auto-generate QR code
	// 		if (categoryName) {
	// 			try {
	// 				const setupUri = composeSetupUri({
	// 					categoryId: parsed.categoryId,
	// 					flag: parsed.flag,
	// 					password: parsed.password,
	// 					setupId: parsed.setupId,
	// 					reserved: parsed.reserved,
	// 					version: parsed.version,
	// 				});

	// 				const svg = await composeQrCode({
	// 					pairingCode: parsed.password,
	// 					setupUri,
	// 				});
	// 				setQrCodeSvg(svg);
	// 			} catch (error) {
	// 				console.error('Error generating QR code:', error);
	// 			}
	// 		}
	// 	}

	// 	// Stop scanning after successful scan
	// 	// stopScanning();
	// };

	const isFormValid =
		setupCode &&
		category &&
		flag !== undefined &&
		setupCode.trim() !== '' &&
		setupId.trim() !== '';

	const handleGenerate = async () => {
		if (!isFormValid) {
			return;
		}

		try {
			const categoryId = CATEGORIES[category as keyof typeof CATEGORIES];
			const setupUri = composeSetupUri({
				categoryId,
				flag,
				password: setupCode,
				setupId,
			});

			const svg = await composeQrCode({
				pairingCode: setupCode,
				setupUri,
			});

			setQrCodeSvg(svg);
		} catch (error) {
			console.error('Error generating QR code:', error);
		}
	};

	const handleDownload = () => {
		if (!qrCodeSvg) {
			return;
		}

		const blob = new Blob([qrCodeSvg], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `homekit-${category}-${setupCode}.svg`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return (
		<HomeKitDataContextProvider>
			<div className="app">
				<main className="form-container">
					<Scan />

					<div className="qr-code-details-container">
						<div className="input-group">
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<label htmlFor="setup-code">Setup Code</label>
							</div>
							<input
								id="setup-code"
								type="text"
								value={setupCode}
								onChange={handleSetupCodeChange}
								placeholder="Ex: 12345678"
								className="form-input"
							/>
						</div>

						<div className="input-group">
							<label htmlFor="category">Device Category</label>
							<select
								id="category"
								value={category}
								onChange={e => setCategory(e.target.value)}
								className="form-select"
							>
								<option value="">Select a category</option>
								{HOMEKIT_CATEGORIES.map(cat => (
									<option key={cat} value={cat}>
										{cat.charAt(0).toUpperCase() + cat.slice(1)}
									</option>
								))}
							</select>
						</div>

						<div className="input-group">
							<label htmlFor="flag">Connection Type</label>
							<select
								id="flag"
								value={flag ?? ''}
								onChange={e => setFlag(Number(e.target.value))}
								className="form-select"
							>
								<option value={1}>NFC</option>
								<option value={2}>IP</option>
								<option value={4}>BLE</option>
								<option value={8}>
									Wireless Accessory Configuration (WAC)/Apple's MFi
								</option>
							</select>
						</div>

						<div className="input-group">
							<label htmlFor="setup-id">Setup ID</label>
							<input
								id="setup-id"
								type="text"
								value={setupId}
								onChange={e => setSetupId(e.target.value)}
								placeholder="Setup identifier"
								className="form-input"
							/>
						</div>

						<button
							className="generate-button"
							onClick={handleGenerate}
							disabled={!isFormValid}
						>
							Generate HomeKit Setup Code
						</button>
					</div>

					{qrCodeSvg && (
						<div className="qr-code-container">
							<div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />

							<button className="download-button" onClick={handleDownload}>
								Download SVG
							</button>
						</div>
					)}
				</main>
			</div>
		</HomeKitDataContextProvider>
	);
}

export default App;
