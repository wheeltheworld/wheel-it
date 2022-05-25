import React from "react";
import axios from "axios";
import FormGenerator from "../components/FormGenerator";
import { useHistory } from "react-router-dom";
import useManifest from "../utils/hooks/useManifest";
import { Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useNotification } from "../utils/hooks/useNotification";

interface CreatePageProps {
  moduleName: string;
  modelName: string;
}

const CreatePage: React.FC<CreatePageProps> = ({ moduleName, modelName }) => {
  const { endpoint, manifest, get } = useManifest();
  const { push } = useHistory();
  const { success, error } = useNotification();

  if (!manifest) {
    return null;
  }

  const { fields, children, label } = get({ moduleName, modelName });

  const handleSubmit = async (data: any) => {
    try {
      const { data: ent } = await axios.post(
        endpoint({
          modelName,
          moduleName,
        }),
        data
      );
      const indexable = fields.indexables[0]?.name;
      success({
        title: `Success`,
        description: `${label} created successfully`,
      });
      if (indexable) {
        push(`/_/${moduleName}/${modelName}/${indexable}/${ent[indexable]}`);
      } else {
        push(`/_/${moduleName}/${modelName}`);
      }
    } catch (e) {
      error({
        title: `Error`,
        description: `${e}`,
      });
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
        moduleName={moduleName}
        modelName={modelName}
        children={children}
      />
    </>
  );
};

export default CreatePage;
