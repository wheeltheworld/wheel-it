import { useToast, UseToastOptions } from "@chakra-ui/react";

interface Notify {
  title: string;
  description: string;
}

export const useNotification = () => {
  const toast = useToast();

  const notify =
    (status: UseToastOptions["status"]) =>
    ({ title, description }: Notify) => {
      toast({
        title,
        description,
        status,
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    };

  const success = notify("success");
  const error = notify("error");
  const warning = notify("warning");
  const info = notify("info");

  return {
    success,
    error,
    warning,
    info,
  };
};
