import React, { ReactElement, ReactNode } from "react";
import { Route } from "react-router-dom";
import { useWheel } from "../../../client/components/WheelProvider";
import CreatePage from "../../../client/pages/CreatePage";
import EditPage from "../../../client/pages/EditPage";
import ListPage from "../../../client/pages/ListPage";
import PreviewPage from "../../pages/PreviewPage";
import useManifest from "./useManifest";

interface UseRoutes {
  withNotFound?: boolean;
}

export const useRoutes = (
  { withNotFound = false }: UseRoutes = { withNotFound: false }
): ReactNode[] => {
  const { manifest } = useManifest();
  const { pageWrapper: PageWrapper } = useWheel();
  const routes: ReactNode[] = [];

  const wrap = (element: ReactElement): ReactElement => {
    if (PageWrapper) {
      return <PageWrapper>{element}</PageWrapper>;
    }
    return element;
  };

  if (!manifest) return routes;

  for (const m of Object.values(manifest.modules)) {
    models: for (const model of Object.values(m.models)) {
      if (!model.isAutonomous) continue models;
      const createRoute = (
        <Route
          path={`/_/${m.name}/${model.name}/create`}
          key={`create-${m.name}.${model.name}`}
          element={wrap(
            <CreatePage
              modelName={model.name}
              modelLabel={model.label}
              moduleName={m.name}
            />
          )}
        />
      );
      const listRoute = (
        <Route
          path={`/_/${m.name}/${model.name}`}
          key={`list-${m.name}.${model.name}`}
          element={wrap(
            <ListPage
              modelName={model.name}
              modelLabel={model.label}
              moduleName={m.name}
            />
          )}
        />
      );
      routes.push(createRoute, listRoute);
      for (const indexable of model.fields.indexables) {
        const previewRoute = (
          <Route
            path={`/_/${m.name}/${model.name}/${indexable.name}/:value`}
            key={`preview-${m.name}.${model.name}.${indexable.name}`}
            element={wrap(
              <PreviewPage
                modelName={model.name}
                modelLabel={model.label}
                moduleName={m.name}
                by={indexable.name}
              />
            )}
          />
        );
        const editRoute = (
          <Route
            path={`/_/${m.name}/${model.name}/${indexable.name}/:value/edit`}
            key={`edit-${m.name}.${model.name}.${indexable.name}`}
            element={wrap(
              <EditPage
                modelName={model.name}
                modelLabel={model.label}
                moduleName={m.name}
                by={indexable.name}
              />
            )}
          />
        );
        routes.push(editRoute, previewRoute);
      }
    }
  }

  if (withNotFound) {
    routes.push(
      <Route
        key="not-found"
        element={wrap(
          <div>
            <h1>Not Found</h1>
          </div>
        )}
      />
    );
  }

  return routes;
};
