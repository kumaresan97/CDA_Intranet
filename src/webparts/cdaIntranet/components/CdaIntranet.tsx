/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import type { ICdaIntranetProps } from "./ICdaIntranetProps";
import "../assets/css/styles.css";
import { sp } from "@pnp/sp/presets/all";
import { graph } from "@pnp/graph/rest";
import { LanguageProvider } from "./useContext/useContext";
import MainpageWrapper from "./MainpageWrapper";

export default class CdaIntranet extends React.Component<
  ICdaIntranetProps,
  {}
> {
  constructor(prop: ICdaIntranetProps) {
    super(prop);

    sp.setup({
      spfxContext: this.props.context as any,
    });
    // Graph context
    graph.setup({
      spfxContext: this.props.context as any,
    });
  }
  public render(): React.ReactElement<ICdaIntranetProps> {
    return (
      <div>
        <LanguageProvider context={this.props.context}>
          <MainpageWrapper />
        </LanguageProvider>
      </div>
    );
  }
}
