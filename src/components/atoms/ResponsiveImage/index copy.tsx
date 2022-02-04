import { breakpoints } from '@theme/DesignSystem/Variables';
import { useViewport, useWebPSupport } from '@hooks/index';
import { useState } from 'react';
import { StyledResponsiveImage, Placeholder, Picture, Img } from './styled';
import { IResponsiveImage } from './interfaces';
import { useInView } from 'react-intersection-observer';
import { imagePlaceholderQuality } from '@theme/DesignSystem/Variables';

const ResponsiveImage = ({
    class_name,
    dimensions_fit,
    lazy,
    alt,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
}: IResponsiveImage) => {
    const { viewportName } = useViewport();
    const [isLoaded, setIsLoaded] = useState(false);
    const [pictureRef, inView] = useInView({
        threshold: 0,
        rootMargin: '0px',
        triggerOnce: true,
    });

    const sourcesFrag = () => {
        const sourcesProps = [xs, sm, md, lg, xl, xxl].reverse();

        let sources: any = [];

        Object.keys(breakpoints)
            .reverse()
            .forEach((breakpoint, i) => {
                const br = sourcesProps[i];
                sources.push(
                    <source
                        key={i}
                        srcSet={
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useWebPSupport()
                                ? br ? br.image.url + '?format=webp' : ''
                                : br ? br.image.url : ''
                        }
                        media={`(min-width:${breakpoints[breakpoint]}px)`}
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        type={useWebPSupport() ? 'image/webp' : ''}
                    />);
                }
            );

        return sources;
    };

    const getDimensions = () => {
        let dimensions;
        if(viewportName)
            switch (viewportName) {
                default:
                    dimensions = undefined;
                case 'xs':
                    dimensions = [xs.width, xs.height];
                    break;
                case 'sm':
                    if (sm && sm.width != null) {
                        dimensions = [sm.width, sm.height];
                    } else {
                        dimensions = [xs.width, xs.height];
                    }
                    break;
                case 'md':
                    if (md && md.width != null) {
                        dimensions = [md.width, md.height];
                    } else if (sm && sm.width != null) {
                        dimensions = [sm.width, sm.height];
                    } else {
                        dimensions = [xs.width, xs.height];
                    }
                    break;
                case 'lg':
                    if (lg && lg.width != null) {
                        dimensions = [lg.width, lg.height];
                    } else if (md && md.width != null) {
                        dimensions = [md.width, md.height];
                    } else if (sm && sm.width != null) {
                        dimensions = [sm.width, sm.height];
                    } else {
                        dimensions = [xs.width, xs.height];
                    }
                    break;
                case 'xl':
                    if (xl && xl.width != null) {
                        dimensions = [xl.width, xl.height];
                    } else if (lg && lg.width != null) {
                        dimensions = [lg.width, lg.height];
                    } else if (md && md.width != null) {
                        dimensions = [md.width, md.height];
                    } else if (sm && sm.width != null) {
                        dimensions = [sm.width, sm.height];
                    } else {
                        dimensions = [xs.width, xs.height];
                    }
                    break;
                case 'xxl':
                    if (xxl && xxl.width != null) {
                        dimensions = [xxl.width, xxl.height];
                    } else if (xl && xl.width != null) {
                        dimensions = [xl.width, xl.height];
                    } else if (lg && lg.width != null) {
                        dimensions = [lg.width, lg.height];
                    } else if (md && md.width != null) {
                        dimensions = [md.width, md.height];
                    } else if (sm && sm.width != null) {
                        dimensions = [sm.width, sm.height];
                    } else {
                        dimensions = [xs.width, xs.height];
                    }
                    break;
            }
        return dimensions;
    };

    const dynamicPadding = () => {
        return (getDimensions()[1] / getDimensions()[0]) * 100 + '%';
    };

    const pictureFrag = (
        <Picture>
            {sourcesFrag()}
            <Img
                lazy={lazy}
                alt={alt}
                onLoad={() => {
                    setIsLoaded(true);
                }}
                width={getDimensions()[0]}
                height={getDimensions()[1]}
            />
        </Picture>
    );

    const placeHolderFrag = (
        <Placeholder>
            <source
                srcSet={xs.image.url + `?format=jpg&quality=${imagePlaceholderQuality}`}
            />
            <Img
                alt={alt}
                width={getDimensions()[0]}
                height={getDimensions()[1]}
                className={isLoaded && 'isLoaded'}
            />
        </Placeholder>
    );

    return (
        <StyledResponsiveImage
            ref={pictureRef}
            className={class_name}
            dynamicPadding={!dimensions_fit && dynamicPadding()}
            width={getDimensions()[0]}
            height={getDimensions()[1]}
            dimensions_fit={dimensions_fit}
        >
            {lazy ? (
                <>
                    {placeHolderFrag}
                    {inView && pictureFrag}
                </>
            ) : (
                pictureFrag
            )}
        </StyledResponsiveImage>
    );
};

ResponsiveImage.defaultProps = {
    class_name: null,
    dimensions_fit: false,
    lazy: true,
    xs: { image: {} },
    sm: {},
    md: {},
    lg: {},
    xl: {},
    xxl: {},
};

export default ResponsiveImage;
