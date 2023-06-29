import React, { useState, useEffect } from "react";
import styles from "./SynthesisLineChart.module.scss";
import { withLoading } from "@logora/debate.tools.with_loading";
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useIntl } from "react-intl";
import { Line } from 'react-chartjs-2';
import Select from '@logora/debate.input.select';
import { Tag } from '@logora/debate.tag.tag';
import cx from 'classnames';

const SynthesisLineChart = (props) => {
  const intl = useIntl();
  const api = useDataProvider();
  const FILTER_OPTIONS = [{ name: intl.formatMessage({ id: "info.day" }), value: "day", text: intl.formatMessage({ id: "info.day" }) }, { name: intl.formatMessage({ id: "info.week" }), value: "week", text: intl.formatMessage({ id: "info.week" }) },  { name: intl.formatMessage({ id: "info.month" }), value: "month", text: intl.formatMessage({ id: "info.month" }) }]
  const CHART_OPTIONS = {responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, font: { size: "16" }, text: props.title}, legend: { position: "top", align: "center" } }, scales: { y: { beginAtZero: true, grid: { drawOnChartArea: true, color: "#f1f1f1" } }, x: { grid: { drawOnChartArea: false } } } };
  const startDate = props.startDate;
  const endDate = props.endDate;

  const [metric, setMetric] = useState("day");
  const [activeTagId, setActiveTagId] = useState(null);
  const [contentData, setContentData] = useState(undefined);
  const [votesData, setVotesData] = useState(undefined);
  const [lineChartData, setLineChartData] = useState();

  useEffect(() => {
    props.setIsLoading(true);
  }, [])

  useEffect(() => {
    loadContentStats(metric, activeTagId);
    loadVotesStats(metric, activeTagId);
  }, [activeTagId])

  useEffect(() => {
    if(contentData != undefined && votesData != undefined) {
      formatLineChartData(contentData, votesData);
    }
  }, [contentData, votesData])

  const onSetMetric = (value) => {
    props.setIsLoading(true);
    setMetric(value);
    loadContentStats(value, activeTagId);
    loadVotesStats(value, activeTagId);
  }

  const loadContentStats = (metric, tagId) => {
    let data = {
			filter: metric,
			from_date: startDate,
			to_date: endDate,
			[props.dataKeyId]: props.contentId
		};
		if (tagId) {
			data = {...data, tag_id: tagId}
		}
    api.getOne(props.contentRoute, "", data).then(
			response => {
				if(response.data.success) {
					setContentData(response.data.data.resource);
				} else {
					console.log(error)
				}
			}).catch(
				error => {
					console.log(error)
			});
  }

  const loadVotesStats = (metric, tagId) => {
		let data = {
			filter: metric,
			from_date: startDate,
			to_date: endDate,
			[props.dataKeyId]: props.contentId
		};
		if (tagId) {
			data = {...data, tag_id: tagId}
		}
    api.getOne(props.votesRoute, "", data).then(
			response => {
				if(response.data.success) {
					setVotesData(response.data.data.resource);
				} else {
					console.log(error)
				}
			}).catch(
				error => {
					console.log(error)
			});
  }

  const formatLineChartData = (contentData, votesData) => {
    let finalData = {
      labels: contentData.map(elm => elm.dimension.split("-").reverse().join("-")).map((elm, index) => index % 3 === 0 ? elm : ""),
      datasets: [
        {
          label: props.contentLabel,
          data: contentData.map(elm => elm.value),
          fill: false,
          borderColor: props.contentColor,
          backgroundColor: `${props.contentColor}88`,
          tension: 0.2
        },
        {
          label: props.votesLabel,
          data: votesData.map(elm => elm.value),
          fill: false,
          borderColor: props.votesColor,
          backgroundColor: `${props.votesColor}88`,
          tension: 0.2
        },
      ]
    }
    setLineChartData(finalData);
    props.setIsLoading(false);
  }

  const displayTags = (tag) => {
    return (
      <div className={styles.tagItem} key={tag.id} onClick={() => setActiveTagId(tag.id == activeTagId ? null : tag.id)}>
        <Tag active={activeTagId === tag.id ? true : false} text={tag.display_name ? tag.display_name : tag.name} />
      </div>
    );
  }

  return (
    <div className={cx(styles.lineChartContainer, props.className)}>
      <div className={styles.lineChartFilterOptions}>
        <Select displayOptionValue={metric} onChange={(selectedObject) => onSetMetric(selectedObject.value)} options={FILTER_OPTIONS} />
        {props.tags && <div className={styles.filterTagList}>{[{id: null , display_name: intl.formatMessage({ id: "info.all" }), name: "aaa"}, ...props.tags].sort((a, b) => {return (a['name'].localeCompare(b['name'], 'fr', {ignorePunctuation: true}))}).map(displayTags)}</div>}
      </div>
      {!props.isLoading &&
        <div className={styles.lineChartWrapper}>
          <Line data={lineChartData} options={CHART_OPTIONS} />
        </div>
      }
    </div>
  )
}

export default withLoading(SynthesisLineChart);