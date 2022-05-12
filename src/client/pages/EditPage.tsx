import React from "react";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import { useHistory, useParams } from "react-router-dom";
import FormGenerator from "../components/FormGenerator";
import { useEntity } from "../utils/hooks/useEntity";
import useManifest from "../utils/hooks/useManifest";

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
  const { value } = useParams<{ value: string }>();
  const entity = useEntity({
    moduleName,
    modelName,
    by,
    value,
  });
  const { push } = useHistory();
  const { manifest, endpoint, get } = useManifest();

  if (!manifest) {
    return null;
  }

  const fields = get({ moduleName, modelName }).fields;

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
        fields={fields.all}
        onSubmit={handleSubmit}
        initValues={entity}
      />
    </>
  );
};

export default EditPage;
