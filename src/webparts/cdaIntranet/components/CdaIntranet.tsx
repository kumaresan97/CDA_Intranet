import * as React from 'react';
// import styles from './CdaIntranet.module.scss';
import type { ICdaIntranetProps } from './ICdaIntranetProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import "../assets/css/styles.css";
// import Mainpage from './Mainpage';
import { sp } from '@pnp/sp/presets/all';
import { graph } from '@pnp/graph/rest';
import { LanguageProvider } from './useContext/useContext';
import MainpageWrapper from './MainpageWrapper';

// import { CascadingDropdown } from './Cascading';

export default class CdaIntranet extends React.Component<ICdaIntranetProps, {}> {

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
    // const {
    //   description,
    //   isDarkTheme,
    //   environmentMessage,
    //   hasTeamsContext,
    //   userDisplayName
    // } = this.props;
    // const currentLang = document.documentElement.getAttribute("lang") || "en";
    // console.log("currentLang: ", currentLang);


    return (
      <div>

        {/* <CascadingDropdown /> */}
        <LanguageProvider context={this.props.context}>
          {/* <Mainpage context={this.props.context} /> */}
          <MainpageWrapper />


        </LanguageProvider>



      </div>

    );
  }
}
