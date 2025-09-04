import { createContext, useContext, useState, type ReactNode } from 'react';

interface HomeKitData {
	password?: string;
	category?: string;
	flag?: number;
	setupId?: string;
	reserved?: number;
	version?: number;
}

interface HomeKitDataContext extends HomeKitData {
	setHomeKitData: (data: HomeKitData) => unknown;
}

const HomeKitContext = createContext<HomeKitDataContext | null>(null);

interface HomeKitContextProviderProps {
	children: ReactNode;
}

function HomeKitDataContextProvider({ children }: HomeKitContextProviderProps) {
	const [hkData, setHkData] = useState<HomeKitData>({});

	const handleChange = (newData: HomeKitData) => {
		setHkData(newData);
	};

	const value: HomeKitDataContext = {
		...hkData,
		setHomeKitData: handleChange,
	};

	return (
		<HomeKitContext.Provider value={value}>{children}</HomeKitContext.Provider>
	);
}

function useHomeKitData() {
	const context = useContext(HomeKitContext);

	if (!context) {
		throw new Error(
			'useHomeKitData must be used within a HomeKitDataContextProvider!'
		);
	}

	return context;
}

export { HomeKitDataContextProvider, useHomeKitData };
