import React from "react";
import axios from "axios";
import {
  Button,
  Flex,
  Heading,
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
import type { FieldsAndRels } from "./ListPage";
import type { ManifestRelation } from "../../shared/manifest";
import { getPreviewables } from "../utils/funcs/listables";

interface PreviewPageProps {
  moduleName: string;
  modelName: string;
  modelLabel: string;
  by: string;
}

const PreviewPage: React.FC<PreviewPageProps> = ({
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
        description: `${model.label} deleted successfully`,
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

  const previewables = getPreviewables(model);

  return (
    <>
      <Heading>Preview {modelLabel}</Heading>
      <TableContainer whiteSpace="unset">
        <Table size="sm" variant="unstyled">
          <Tbody>
            {previewables.map((field, i) => (
              <React.Fragment key={`${field.name}-${i}`}>
                {(field as ManifestRelation).relationName ? (
                  (() => {
                    const rel = get({
                      moduleName,
                      modelName: field.name,
                    });
                    const rf = field as ManifestRelation;
                    const relPrevRels: FieldsAndRels = rel.relations.filter(
                      (f) => f.isPreviewable && !f.isHidden
                    );
                    const relprevs: FieldsAndRels = ([] as FieldsAndRels)
                      .concat(rel.fields.previewables, relPrevRels)
                      .filter(Boolean);
                    relprevs.sort((a, b) => a.position - b.position);
                    return Array.isArray(entity[rf.relationName]) ? (
                      <Tr>
                        <Td paddingX={8} w="170px" valign="top">
                          <b>{field.label}</b>
                        </Td>
                        <Td w="170px" valign="top">
                          {`${entity[rf.relationName].length} ${
                            rf.relationName
                          }`}
                        </Td>
                      </Tr>
                    ) : (
                      <>
                        <Tr>
                          <Td w="170px" valign="top">
                            <Heading as="h5" size="sm">
                              {field.label}
                            </Heading>
                          </Td>
                          <Td w="170px" valign="top"></Td>
                        </Tr>
                        {relprevs.map((relfield, i) => (
                          <Tr key={`${relfield.name}-${i}`}>
                            <Td paddingX={8} w="170px" valign="top">
                              <b>{relfield.label}</b>
                            </Td>
                            <Td w="170px" valign="top">
                              {entity[field.name] &&
                                fieldValueToString(
                                  relfield,
                                  entity[field.name][relfield.name]
                                )}
                            </Td>
                          </Tr>
                        ))}
                      </>
                    );
                  })()
                ) : (
                  <Tr>
                    <Td paddingX={8} w="170px" valign="top">
                      <b>{field.label}</b>
                    </Td>
                    <Td w="170px" valign="top">
                      {fieldValueToString(field, entity[field.name])}
                    </Td>
                  </Tr>
                )}
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex marginTop={8}>
        <Button
          as={RouterLink}
          to={`/_/${moduleName}/${modelName}/${by}/${value}/edit`}
          marginRight={6}
          rounded="md"
          display="block"
          w="fit-content"
          p="10px 20px"
          bgColor="#02B2AD"
          color="white"
          _hover={{ bgColor: "#007187" }}
          _focus={{ bgColor: "#004D5C" }}
          _disabled={{ bgColor: "#02B2AD", opacity: 0.5 }}
        >
          Edit
        </Button>
        <Button colorScheme="red" onClick={handleDelete}>
          Delete
        </Button>
        <Button
          as={RouterLink}
          to={`/_/${moduleName}/${modelName}/`}
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
          Go back
        </Button>
      </Flex>
    </>
  );
};

export default PreviewPage;
