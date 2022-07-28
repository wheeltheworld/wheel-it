import React from "react";
import axios from "axios";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import FormGenerator from "../components/FormGenerator";
import { useEntity } from "../utils/hooks/useEntity";
import useManifest from "../utils/hooks/useManifest";
import { Link as RouterLink } from "react-router-dom";
import { useNotification } from "../utils/hooks/useNotification";
import { cleanData, RelationModifies } from "../utils/funcs/cleanData";

interface EditPageProps {
  moduleName: string;
  modelName: string;
  modelLabel: string;
  by: string;
}

const EditPage: React.FC<EditPageProps> = ({
  moduleName,
  modelName,
  modelLabel,
  by,
}) => {
  const { value } = useParams<{ value: string }>();
  const entity = useEntity({
    moduleName,
    modelName,
    by,
    value,
  });
  const navigate = useNavigate();
  const { manifest, endpoint, get } = useManifest();
  const { success, error } = useNotification();

  if (!manifest) {
    return null;
  }

  const model = get({ moduleName, modelName });
  const { fields, label } = model;

  const handleSubmit = async (data: any, modifies: RelationModifies) => {
    try {
      const { data: ent } = await axios.patch(
        endpoint({
          modelName,
          moduleName,
          by,
          value,
        }),
        cleanData(model, data, modifies)
      );

      const indexable = fields.indexables[0]?.name;

      success({
        title: "Success",
        description: `${label} updated successfully`,
      });

      if (indexable) {
        navigate(
          `/_/${moduleName}/${modelName}/${indexable}/${ent[indexable]}`
        );
      } else {
        navigate(`/_/${moduleName}/${modelName}`);
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
      navigate(`/_/${moduleName}/${modelName}`);
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
      <Heading>Edit {modelLabel}</Heading>
      <FormGenerator
        onSubmit={handleSubmit}
        initValues={entity}
        modelName={modelName}
        moduleName={moduleName}
      />
      <Flex justify="flex-end" marginTop={-10}>
        <Button
          as={RouterLink}
          to={`/_/${moduleName}/${modelName}/${by}/${entity[by]}`}
          marginRight={6}
          rounded="md"
          display="block"
          w="fit-content"
          p="10px 20px"
          bgColor="transparent"
          color="#02B2AD"
          border="1px solid"
          borderColor="#02B2AD"
          _hover={{ bgColor: "#D1F1F0" }}
          _focus={{
            bgColor: "#D1F1F0",
            borderColor: "#007187",
            color: "#007187",
          }}
          _disabled={{ bgColor: "#D1F1F0", opacity: 0.5 }}
        >
          Go Back
        </Button>
        <Button colorScheme="red" onClick={handleDelete}>
          Delete
        </Button>
      </Flex>
    </>
  );
};

export default EditPage;
