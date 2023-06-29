import React from 'react';
import PropTypes from "prop-types";
import { ArgumentHeader } from '@logora/debate.argument.argument_header';
import { Link } from '@logora/debate.action.link';
import { ArrowIcon } from "@logora/debate.icons";
import { ReadMore } from '@logora/debate.text.read_more';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import styles from './ArgumentBox.module.scss';

export const ArgumentBox = ({ author, tag, date, title = '', content, link, argumentCount = 0, tagClassName, headerOneLine = false, showFooter = false }) => {
    return (
        <div className={styles.argumentBox}>
            <>
                <ArgumentHeader 
                    author={author} 
                    tag={tag}
                    tagClassName={tagClassName}
                    date={date}
                    oneLine={headerOneLine}
                />
                <div className={styles.argumentBody}>
                    { title &&
                        <div className={styles.title}>
                            { title }
                        </div>
                    }
                    <ReadMore 
                        content={content}
                        contentCharCount={150}
                        to={link} 
                        data-tid={"link_argument_read_more"}
                        target="_top"
                        external
                        readMoreText={
                            <div className={styles.readMore}>
                                <FormattedMessage id="argument.argument_box.read_more" defaultMessage={"Read more"} />
                                <ArrowIcon height={25} width={25} className={styles.arrow} />
                            </div>
                        }
                    />
                </div>
                { showFooter &&
                    <Link 
                        className={cx(styles.argumentBoxFooter, tagClassName)} 
                        to={link}
                        data-tid={"link_arguments_read_more"}
                        target="_top"
                        external
                    >
                        <FormattedMessage 
                            id="argument.argument_box.read_more_arguments" 
                            values={{ count: argumentCount, position: tag }}
                            defaultMessage={'Read {count} arguments "{position}"'}
                        />
                    </Link>
                }
            </>
        </div>
    );
}

ArgumentBox.propTypes = {
    /** Object containing the author name */
    author: PropTypes.object.isRequired,
    /** Tag displayed in the header */
    tag: PropTypes.string,
    /** Date displayed in the header */
    date: PropTypes.instanceOf(Date),
    /** Title of the argument */
    title: PropTypes.string,
    /** Content of the argument */
    content: PropTypes.string.isRequired,
    /** Call-to-action URL */
    link: PropTypes.string.isRequired,
    /** Number of arguments in the debate */
    argumentCount: PropTypes.number,
    /** CSS class name of the argument's tag  */
    tagClassName: PropTypes.string,
    /** Show author, position and date in one line */
    headerOneLine: PropTypes.bool,
    /** Show footer link to read more arguments */
    showFooter: PropTypes.bool,
};

ArgumentBox.defaultProps = {
    argumentCount: 0,
    tagClassName: '',
    headerOneLine: false,
    showFooter: false,
};