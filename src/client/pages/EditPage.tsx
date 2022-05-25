import React from "react";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import { useHistory, useParams } from "react-router-dom";
import FormGenerator from "../components/FormGenerator";
import { useEntity } from "../utils/hooks/useEntity";
import useManifest from "../utils/hooks/useManifest";
import { Link as RouterLink } from "react-router-dom";
import { useNotification } from "../utils/hooks/useNotification";

interface EditPageProps {
  moduleName: string;
  modelName: string;
  by: string;
}

const EditPage: React.FC<EditPageProps> = ({ moduleName, modelName, by }) => {
  const { value } = useParams<{ value: string }>();
  const entity = useEntity({
    moduleName,
    modelName,
    by,
    value,
  });
  const { push } = useHistory();
  const { manifest, endpoint, get } = useManifest();
  const { success, error } = useNotification();

  if (!manifest) {
    return null;
  }

  const { fields, children, label } = get({ moduleName, modelName });

  const handleSubmit = async (data: any) => {
    try {
      const { data: ent } = await axios.patch(
        endpoint({
          modelName,
          moduleName,
          by,
          value,
        }),
        data
      );

      const indexable = fields.indexables[0]?.name;

      success({
        title: "Success",
        description: `${label} updated successfully`,
      });

      if (indexable) {
        push(`/_/${moduleName}/${modelName}/${indexable}/${ent[indexable]}`);
      } else {
        push(`/_/${moduleName}/${modelName}`);
      }
    } catch (e) {
      error({
        title: "Error",
        description: `${e}`,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        endpoint({
          modelName,
          moduleName,
          by,
          value,
        })
      );
      success({
        title: "Success",
        description: `${label} deleted successfully`,
      });
      push(`/_/${moduleName}/${modelName}`);
    } catch (e) {
      error({
        title: "Error",
        description: `${e}`,
      });
    }
  };

  if (!entity) {
    return null;
  }

  return (
    <>
      <Button as={RouterLink} to={`/_/${moduleName}/${modelName}`}>
        Go Back
      </Button>
      <Button colorScheme="red" onClick={handleDelete}>
        Delete
      </Button>
      <FormGenerator
        fields={fields.all}
        onSubmit={handleSubmit}
        initValues={entity}
        modelName={modelName}
        moduleName={moduleName}
        children={children}
      />
    </>
  );
};

export default EditPage;
