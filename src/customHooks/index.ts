import { useState } from "react";

export interface ModalProps<T> {
    showModal: boolean;
    resource: T | null;
}

export type SetModalPropsType<T> = React.Dispatch<React.SetStateAction<ModalProps<T>>>;
export const useModalState: <T>(arg: ModalProps<T>) => [ModalProps<T>, SetModalPropsType<T>] = useState;