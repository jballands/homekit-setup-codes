import type { ChangeEvent } from 'react';

import { useEffect, useState } from 'react';
import { useHomeKitData } from '../HomeKitDataContext';
import { POSSIBLE_CATEGORIES } from './possibleCategories';
import './Form.css';

function Form() {
	const { setHomeKitData, ...homeKitData } = useHomeKitData();

	const [isFormValid, setIsFormValid] = useState(false);

	const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		setHomeKitData({ ...homeKitData, password: event.target.value });
	};

	const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setHomeKitData({ ...homeKitData, category: event.target.value });
	};

	const handleFlagChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setHomeKitData({ ...homeKitData, flag: Number(event.target.value) });
	};

	const handleSetupIdChange = (event: ChangeEvent<HTMLInputElement>) => {
		setHomeKitData({ ...homeKitData, setupId: event.target.value });
	};

	useEffect(() => {
		const { setupId, flag, password, category } = homeKitData;

		const isFormValid =
			category !== undefined &&
			flag !== undefined &&
			password !== undefined &&
			setupId !== undefined &&
			password.trim() !== '' &&
			setupId.trim() !== '';

		setIsFormValid(isFormValid);
	}, [homeKitData]);

	return (
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
					value={homeKitData.password}
					onChange={handlePasswordChange}
					placeholder="Ex: 12345678"
					className="form-input"
				/>
			</div>

			<div className="input-group">
				<label htmlFor="category">Device Category</label>
				<select
					id="category"
					value={homeKitData.category}
					onChange={handleCategoryChange}
					className="form-select"
				>
					<option value="">Select a category</option>
					{POSSIBLE_CATEGORIES.map((c: string) => (
						<option key={c} value={c}>
							{c.charAt(0).toUpperCase() + c.slice(1)}
						</option>
					))}
				</select>
			</div>

			<div className="input-group">
				<label htmlFor="flag">Connection Type</label>
				<select
					id="flag"
					value={homeKitData.flag}
					onChange={handleFlagChange}
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
					value={homeKitData.setupId}
					onChange={handleSetupIdChange}
					placeholder="Setup identifier"
					className="form-input"
				/>
			</div>

			<button
				className="generate-button"
				onClick={() => {}}
				disabled={!isFormValid}
			>
				Generate HomeKit Setup Code
			</button>
		</div>
	);
}

export default Form;
