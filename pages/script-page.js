import React from "react";
import { Page, Layout } from "@shopify/polaris";
import InstallScript from "../components/InstallScripts";
import UninstallScript from "../components/UninstallScripts";
import Axios from "axios";

class ScriptTags extends React.Component {
  state = {
    scriptTagInstalled: false,
  };

  componentDidMount() {
    Axios.get("/api/v1/script_tags").then((resp) => {
      console.log(resp.data.scriptTagStatus);
      this.setState({ scriptTagInstalled: resp.data.scriptTagStatus });
    });
  }

  render() {
    let status = this.state.scriptTagInstalled;
    console.log("The value of status: ", status);
    return (
      <Page>
        <Layout.AnnotatedSection
          title="Install Scripts"
          description="Install scripts by clicking the button"
        >
          <InstallScript scriptTagInstalled={status}></InstallScript>
        </Layout.AnnotatedSection>

        <Layout.AnnotatedSection
          title="Uninstall Scripts"
          description="Uninstall scripts by providing a specific script tag ID and clicking the submit button"
        >
          <UninstallScript></UninstallScript>
        </Layout.AnnotatedSection>
      </Page>
    );
  }
}

export default ScriptTags;
