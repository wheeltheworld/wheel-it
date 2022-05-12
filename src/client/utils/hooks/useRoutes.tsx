import React, { ReactElement, ReactNode } from "react";
import { Route } from "react-router-dom";
import { useWheel } from "../../../client/components/WheelProvider";
import CreatePage from "../../../client/pages/CreatePage";
import EditPage from "../../../client/pages/EditPage";
import ListPage from "../../../client/pages/ListPage";
import useManifest from "./useManifest";

export const useRoutes = (): ReactNode[] => {
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
    for (const model of Object.values(m.models)) {
      const createRoute = (
        <Route
          path={`/_/${m.name}/${model.name}/create`}
          exact
          component={() =>
            wrap(<CreatePage modelName={model.name} moduleName={m.name} />)
          }
        />
      );
      const listRoute = (
        <Route
          path={`/_/${m.name}/${model.name}`}
          exact
          component={() =>
            wrap(<ListPage modelName={model.name} moduleName={m.name} />)
          }
        />
      );
      routes.push(createRoute, listRoute);
      for (const indexable of model.fields.indexables) {
        const editRoute = (
          <Route
            path={`/_/${m.name}/${model.name}/${indexable.name}/:value`}
            exact
            component={() =>
              wrap(
                <EditPage
                  modelName={model.name}
                  moduleName={m.name}
                  by={indexable.name}
                />
              )
            }
          />
        );
        routes.push(editRoute);
      }
    }
  }

  return routes;
};
