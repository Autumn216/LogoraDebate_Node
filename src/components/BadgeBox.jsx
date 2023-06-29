import React from 'react';
import cx from 'classnames';
import { withResponsive } from "@logora/debate.hooks.use_responsive";
import { withAuth } from "@logora/debate.auth.use_auth";
import styles from './BadgeBox.module.scss';
import ProgressBar from "@logora/debate.tools.progress_bar";
import TextFormatter from '../utils/TextFormatter';

const BadgeBox = (props) => {
    const showTitle = () => {
        if (props.user.id === props.currentUser.id) {
            if (props.currentUser.eloquence_title === props.badge.badge.name) {
                return true;
            }
        }
    }

    return (
        <div className={styles.badgeBox}>
            <div className={cx(styles.badgeLevel, styles[`level-${props.badge.badge.level}`])}>
                <TextFormatter id="alt.level" /> {props.badge.badge.level}
            </div>
            <div className={styles.badgeImageBox}>
                <img className={styles.badgeImage} src={props.badge.badge.icon_url} loading={"lazy"} width={80} height={80} title={props.badge.badge.title} alt={`Badge ${props.badge.badge.title}`} />
            </div>
            <div className={styles.badgeName}>
                <TextFormatter id={"badge." + props.badge.badge.name + ".title"} />
            </div>
            <div className={styles.badgeDescription}>
                <TextFormatter 
                    id={"badge." + props.badge.badge.name + ".description"} 
                    variables={{ variable: props.badge.badge.steps }}
                    count={props.badge.badge.steps}
                />
            </div>
            <div className={styles.badgeProgressContainer}>
                {props.badge.progress >= props.badge.badge.steps ?
                    <span><TextFormatter id="info.badge_completed" /></span>
                :
                    <span>{props.badge.progress + "/" + props.badge.badge.steps}</span>
                }
                <ProgressBar 
                    progress={props.badge.progress} 
                    goal={props.badge.badge.steps} 
                    className={styles.badgeProgress} 
                    innerClassName={cx(styles.badgeProgressBar, styles[`level-${props.badge.badge.level}`])} 
                />
            </div>
            {props.badge.badge.next_title_level !== null &&
                <div className={cx(styles.badgeReward, {[styles.rewardObtained]: props.badge.progress >= props.badge.badge.steps, [styles.rewardShown]: showTitle()})}>
                    <span>{showTitle() ? <TextFormatter id="info.badge.title_shown" /> : props.badge.progress >= props.badge.badge.steps ? <TextFormatter id="info.badge.title_obtained" /> : <TextFormatter id="info.badge.title" variables={{variable: props.badge.badge.next_title_level}}/> }</span>
                    <span className={styles.rewardName}>&quot;<TextFormatter id={"badge." + props.badge.badge.name + ".reward"} />&quot;</span>
                </div>
            }
        </div>
    );
}

export default withResponsive(withAuth(BadgeBox));
