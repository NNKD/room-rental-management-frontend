import { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
    isApiLoading: boolean;
    setApiLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isApiLoading, setApiLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isApiLoading, setApiLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};