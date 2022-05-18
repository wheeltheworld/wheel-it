import React from "react";
import axios from "axios";
import FormGenerator from "../components/FormGenerator";
import { useHistory } from "react-router-dom";
import useManifest from "../utils/hooks/useManifest";
import { Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

interface CreatePageProps {
  moduleName: string;
  modelName: string;
}

const CreatePage: React.FC<CreatePageProps> = ({ moduleName, modelName }) => {
  const { endpoint, manifest, get } = useManifest();
  const { push } = useHistory();

  if (!manifest) {
    return null;
  }

  const fields = get({ moduleName, modelName }).fields;

  const handleSubmit = async (data: any) => {
    const { data: ent } = await axios.post(
      endpoint({
        modelName,
        moduleName,
      }),
      data
    );
    const indexable = fields.indexables[0]?.name;

    if (indexable) {
      push(`/_/${moduleName}/${modelName}/${indexable}/${ent[indexable]}`);
    }
  };

  return (
    <>
      <Button as={RouterLink} to={`/_/${moduleName}/${modelName}`}>
        Go Back
      </Button>
      <FormGenerator
        fields={fields.all.filter((f) => !f.isReadonly)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default CreatePage;
