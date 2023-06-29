import React, { useState, useEffect } from 'react';
import { Loader } from '@logora/debate.tools.loader';
import styles from './SourcePreview.module.scss';

export const SourcePreview = (props) => {
	return (
		!props.showLoader && props.source ?
			<div className={styles.sourcePreview}>
				<div>
					{ props.source.origin_image_url ? (
						<div>
							<img className={styles.sourcePreviewImage} src={props.source.origin_image_url} height={200} width={280} alt={`${props.source.title}`}  />
						</div>
					) : null}
				</div>
				<div className={styles.sourcePreviewBody}>
					<div className={styles.sourcePreviewPublisher}>
						{ props.source.publisher }
					</div>
					<div className={styles.sourcePreviewTitle} title={ props.source.title }>
						<a className={styles.sourceLink} href={ props.source.source_url } target="_blank" rel="nofollow noopener noreferrer">
							{ props.source.title }
						</a>
					</div>
					<div className={styles.sourcePreviewDescription}>
						{ props.source.description }
					</div>
				</div>
			</div>
		:
			<Loader />
	);
}
