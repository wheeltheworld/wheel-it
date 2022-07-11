import React from "react";
import axios from "axios";
import {
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEntity } from "../utils/hooks/useEntity";
import useManifest from "../utils/hooks/useManifest";
import { Link as RouterLink } from "react-router-dom";
import { useNotification } from "../utils/hooks/useNotification";
import { fieldValueToString } from "../utils/funcs/fieldValueToString";

interface PreviewPageProps {
  moduleName: string;
  modelName: string;
  by: string;
}

const PreviewPage: React.FC<PreviewPageProps> = ({
  moduleName,
  modelName,
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
      <Button
        as={RouterLink}
        to={`/_/${moduleName}/${modelName}/`}
        variant="ghost"
      >
        Go Back
      </Button>
      <TableContainer whiteSpace="unset">
        <Table size="sm" variant="unstyled">
          <Tbody>
            {fields.previewables.map((field) => (
              <Tr key={field.name}>
                <Td w="170px" valign="top">
                  <b>{field.label}: </b>
                </Td>
                <Td valign="top">
                  {fieldValueToString(field, entity[field.name])}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex>
        <Button
          as={RouterLink}
          colorScheme="blue"
          to={`/_/${moduleName}/${modelName}/${by}/${value}/edit`}
        >
          Edit
        </Button>
        <Button colorScheme="red" onClick={handleDelete}>
          Delete
        </Button>
      </Flex>
    </>
  );
};

export default PreviewPage;
