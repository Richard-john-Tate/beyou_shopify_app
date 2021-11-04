import React, { useState } from 'react';
import { Banner, SettingToggle, TextStyle } from '@shopify/polaris';

const InstallScript = (props) => {
    const { scriptTagInstalled } = props;

    const [active, setActive] = useState(false);

    const handleToggle = () => { 
        fetch('/installScriptTags').then(resp => { console.log(resp); setActive((active) => !active); })
    };

    const contentStatus = active ? 'Uninstall' : 'Install';
    const textStatus = active ? 'installed' : 'not installed';

    if(active || scriptTagInstalled) {
        return (
            <Banner
                title="You have installed the script"
                status="success"
            />
        )
    } else {
        return (
            <>
                <SettingToggle
                    action={{
                        content: contentStatus,
                        onAction: handleToggle,
                    }}
                    enabled={active}
                >
                    The script is <TextStyle variation="strong">{textStatus}</TextStyle>.
                </SettingToggle>
            </>
        )
    } 
}

export default InstallScript;