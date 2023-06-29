import React from 'react';
import { useConfig } from '@logora/debate.context.config_provider';
import { useResponsive } from "@logora/debate.hooks.use_responsive";
import { ArgumentBox } from '@logora/debate.argument.argument_box';
import { ArgumentBlankBox } from '@logora/debate.argument.argument_blank_box';
import styles from './TopArguments.module.scss';

const TopArguments = (props) =>  {
    const config = useConfig();
    const [isMobile, isTablet, isDesktop] = useResponsive();

    const getTopArgument = () => {
        if(props.argumentFor && props.argumentAgainst) {
            return props.argumentFor.score > props.argumentAgainst.score ? props.argumentFor : props.argumentAgainst;
        } else {
            return props.argumentFor || props.argumentAgainst || false;
        }
    }

    const topArgument = getTopArgument();

    const displayArgument = (argument, positionIndex, compact) => {
        return (
            <>
                { argument ?
                    <ArgumentBox 
                        author={argument.author}
                        tag={argument.position?.name} 
                        date={argument.created_at}
                        link={props.debateUrl + "#argument_" + argument.id} 
                        content={argument.content}
                        tagClassName={styles[`positionBackground-${positionIndex}`]}
                        argumentCount={props.argumentCount[positionIndex]} 
                        headerOneLine={compact}
                        showFooter={!compact}
                    />
                :
                    <ArgumentBlankBox 
                        position={props.debate.group_context.positions[positionIndex]}
                        positionClassName={styles[`positionBackground-${positionIndex}`]}
                        debateUrl={props.debateUrl} 
                        oneLineBottom={!compact} 
                    />
                }
            </>
        );
    }

    return (
        <>
            { config.synthesis.newDesign === true || (isMobile && config.synthesis.onlyShowTopArgument === true) ? 
                <div className={styles.topArgumentsUnique}>
                    <div className={styles.topArgument}>
                        { displayArgument(topArgument, topArgument === props.argumentAgainst ? 1 : 0, true) }
                    </div>
                </div>
            :
                <div className={styles.topArguments}>
                    <div className={styles.topArgument}>
                        { displayArgument(props.argumentFor, 0, false) }
                    </div>
                    <div className={styles.topArgument}>
                        { displayArgument(props.argumentAgainst, 1, false) }
                    </div>
                </div>
            }
        </>
    )
}

export default TopArguments;