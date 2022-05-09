import React from "react";
import axios from "axios";
import FormGenerator from "./FormGenerator";
import { useHistory } from "react-router-dom";
import useManifest from "./utils/useManifest";

interface CreatePageProps {
  moduleName: string;
  modelName: string;
  redirectOnCreate?: (id: number) => string;
}

const CreatePage: React.FC<CreatePageProps> = ({
  moduleName,
  modelName,
  redirectOnCreate,
}) => {
  const { endpoint, manifest } = useManifest();
  const { push } = useHistory();

  if (!manifest) {
    return null;
  }

  const fields = manifest.modules[moduleName].models[modelName].fields;

  const handleSubmit = async (data: any) => {
    const { data: res } = await axios.post(
      endpoint({
        modelName,
        moduleName,
      }),
      data
    );
    if (redirectOnCreate) {
      push(redirectOnCreate(res.id));
    }
  };

  return <FormGenerator fields={fields} onSubmit={handleSubmit} />;
};

export default CreatePage;
