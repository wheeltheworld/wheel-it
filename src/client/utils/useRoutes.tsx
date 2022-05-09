import React, { ReactNode } from "react";
import { Route } from "react-router-dom";
import CreatePage from "../CreatePage";
import EditPage from "../EditPage";
import ListPage from "../ListPage";
import useManifest from "./useManifest";

export const useRoutes = (): ReactNode[] => {
  const { manifest } = useManifest();
  const routes: ReactNode[] = [];

  if (!manifest) return routes;

  for (const m of Object.values(manifest.modules)) {
    for (const model of Object.values(m.models)) {
      const createRoute = (
        <Route
          path={`/${m.name}/${model.name}/create`}
          component={() => (
            <CreatePage modelName={model.name} moduleName={m.name} />
          )}
        />
      );
      const listRoute = (
        <Route
          path={`/${m.name}/${model.name}`}
          component={() => (
            <ListPage modelName={model.name} moduleName={m.name} />
          )}
        />
      );
      routes.push(createRoute, listRoute);
      for (const getable of model.getables) {
        const editRoute = (
          <Route
            path={`/${m.name}/${model.name}/${getable}/:value`}
            component={() => (
              <EditPage
                modelName={model.name}
                moduleName={m.name}
                by={getable}
              />
            )}
          />
        );
        routes.push(editRoute);
      }
    }
  }

  return routes;
};
