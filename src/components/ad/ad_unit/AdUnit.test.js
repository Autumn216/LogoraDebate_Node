import React from 'react';
import { render } from '@testing-library/react';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { AdUnit } from './AdUnit';

describe('AdUnit', () => {
    it('should render nothing if config.ads.display is false', () => {
        const { container } = render(
            <ConfigProvider config={{ ads: { display: false } }}>
                <AdUnit
                    type={"banner"}
                    sizes={[[300, 250]]}
                    index={0}
                />
            </ConfigProvider>
        );

        expect(container).toBeEmptyDOMElement()
    });

    it('should render nothing if config.ads.googleAdManager is empty', () => {
        const { container } = render(
            <ConfigProvider config={{ ads: { display: true } }}>
                <AdUnit
                    type={"banner"}
                    sizes={[[300, 250]]}
                    index={0}
                />
            </ConfigProvider>
        );

        expect(container).toBeEmptyDOMElement()
    });

    it('should render nothing if config.ads.googleAdManager is empty', () => {
        const { container } = render(
            <ConfigProvider config={{ ads: { display: true, googleAdManager: {} }}}>
                <AdUnit
                    type={"banner"}
                    sizes={[[300, 250]]}
                    index={0}
                />
            </ConfigProvider>
        );

        expect(container).toBeEmptyDOMElement()
    });

    it('should render nothing if type is not in configuration', () => {
        const { container } = render(
            <ConfigProvider config={{ ads: { display: true, googleAdManager: { sidebar: "my-path" }} }}>
                <AdUnit
                    type={"banner"}
                    sizes={[[300, 250]]}
                    index={0}
                />
            </ConfigProvider>
        );

        expect(container).toBeEmptyDOMElement()
    });

    it('should render nothing if id is not in configuration', () => {
        const type = "banner";

        const { container } = render(
            <ConfigProvider config={{ ads: { display: true, googleAdManager: { [type]: { path: "my-path" } }} }}>
                <AdUnit
                    type={type}
                    sizes={[[300, 250]]}
                    index={0}
                />
            </ConfigProvider>
        );

        expect(container).toBeEmptyDOMElement()
    });

    it('should render div if configuration is set', () => {
        const type = "banner";
        const id = "slot-id";

        const { container } = render(
            <ConfigProvider config={{ ads: { display: true, googleAdManager: { [type]: { id: id } }} }}>
                <AdUnit
                    type={type}
                    sizes={[[300, 250]]}
                />
            </ConfigProvider>
        );

        expect(container.firstChild?.firstChild.id).toBe(id);
    });

    it('should set correct id if index is passed', () => {
        const type = "banner";
        const id = "slot-id";

        const { container } = render(
            <ConfigProvider config={{ ads: { display: true, googleAdManager: { [type]: { id: id } }} }}>
                <AdUnit
                    type={type}
                    sizes={[[300, 250]]}
                    index={3}
                />
            </ConfigProvider>
        );

        expect(container.firstChild?.firstChild.id).toBe(id + "-3");
    });

    it('should set didomi script if consent is true', () => {
        const type = "banner";
        const id = "slot-id";

        const { container } = render(
            <ConfigProvider config={{ consent: { didomi: true }, ads: { display: true, googleAdManager: { [type]: { id: id } }} }}>
                <AdUnit
                    type={type}
                    sizes={[[300, 250]]}
                    index={4}
                />
            </ConfigProvider>
        );

        expect(container.firstChild.tagName).toBe("SCRIPT");
        expect(container.firstChild.type).toBe("didomi/html");
        expect(container.firstChild.getAttribute("data-vendor")).toBe("didomi:google");
        expect(container.firstChild?.firstChild?.firstChild.id).toBe(id + "-4");
    });
});