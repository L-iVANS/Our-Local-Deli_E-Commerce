import { useMutation } from "@apollo/client/react";
import { PLACE_ORDER } from "../services/mutation";

export const usePlaceOrder = () => {
    return useMutation(PLACE_ORDER);
};
