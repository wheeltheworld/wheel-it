import React from "react";
import axios from "axios";
import FormGenerator from "./FormGenerator";
import { Button } from "@chakra-ui/react";
import { useHistory, useParams } from "react-router-dom";
import useManifest from "./utils/useManifest";
import { useEntity } from "./utils/useEntity";

interface EditPageProps {
  moduleName: string;
  modelName: string;
  by: string;
  redirectOnDelete?: string;
}

const EditPage: React.FC<EditPageProps> = ({
  moduleName,
  modelName,
  by,
  redirectOnDelete,
}) => {
  const { entity } = useEntity({
    moduleName,
    modelName,
    by,
  });
  const { push } = useHistory();
  const { manifest, endpoint } = useManifest();
  const { value } = useParams<{ value: string }>();

  if (!manifest) {
    return null;
  }

  const fields = manifest.modules[moduleName].models[modelName].fields;

  const handleSubmit = async (data: any) => {
    await axios.patch(
      endpoint({
        modelName,
        moduleName,
        by,
      }),
      data
    );
  };

  const handleDelete = async () => {
    await axios.delete(
      endpoint({
        modelName,
        moduleName,
        by,
        value,
      })
    );
    if (redirectOnDelete) {
      push(redirectOnDelete);
    }
  };

  return (
    <>
      <Button colorScheme="red" onClick={handleDelete}>
        Delete
      </Button>
      <FormGenerator
        fields={fields}
        onSubmit={handleSubmit}
        initValues={entity}
      />
    </>
  );
};

export default EditPage;
