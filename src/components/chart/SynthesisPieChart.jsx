import React, { useState, useEffect } from "react";
import styles from "./SynthesisPieChart.module.scss";
import { withLoading } from "@logora/debate.tools.with_loading";
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useIntl } from "react-intl";
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const SynthesisPieChart = (props) => {
  const intl = useIntl();
  const api = useDataProvider();
  const PIE_COLORS = ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)', 'rgba(255, 143, 102, 0.8)', 'rgba(93, 82, 179, 0.8)']
  const startDate = props.consultation.created_at;
  const endDate = props.consultation.ends_at;
  const [statsByTag, setStatsByTag] = useState(undefined);
  const [pieChartData, setPieChartData] = useState(undefined);
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    loadStatsByTags(props.statsType);
  }, [])

  useEffect(() => {
    if (statsByTag != undefined) {
      formatPieChartData(statsByTag);
    }
  }, [statsByTag])

  const loadStatsByTags = (type) => {
    let data = {
			filter: "tag_id",
			from_date: startDate,
			to_date: endDate,
			consultation_id: props.consultation.id
		};
    if (type === "proposals") {
      api.getOne("proposals_stats", "", data).then(
        response => {
          if(response.data.success) {
            setMaxValue((100 / response.data.data.resource.length))
            setStatsByTag(response.data.data.resource);
          } else {
            console.log(error)
          }
        }).catch(
          error => {
            console.log(error)
        });
    }
    if (type === "votes") {
      api.getOne("votes_stats", "", data).then(
        response => {
          if(response.data.success) {
            setMaxValue((100 / response.data.data.resource.length))
            setStatsByTag(response.data.data.resource);
          } else {
            console.log(error)
          }
        }).catch(
          error => {
            console.log(error)
        });
    }
  }

  const formatPieChartData = (data) => {
    const negligibleDimensions = props.statsType === "proposals" ? data.filter(item => Math.round((100*item.value)/props.consultation.proposals_count) <= (maxValue * 0.75)) : data.filter(item => Math.round((100*item.value)/props.consultation.total_votes) <= (maxValue * 0.75));
    const otherDimensions = { dimension: "others", value: negligibleDimensions.reduce((a, b) => a + b.value, 0) }
    let finalArr = data.filter(e => !negligibleDimensions.includes(e));
    finalArr.push(otherDimensions);
    
    let finalData = {
      labels: finalArr.map(elm => props.consultation.tags.filter(tag => tag.id == elm.dimension)[0] ? `${props.consultation.tags.filter(tag => tag.id == elm.dimension)[0].name} (${props.statsType === 'proposals' ? Math.round((100*elm.value)/props.consultation.proposals_count) : Math.round((100*elm.value)/props.consultation.total_votes)} %)` : intl.formatMessage({ id: "consultation.synthesis.others" })), // Find correct name associated with tag_id
      datasets: [
        {
          label: '# de propositions par thème',
          data: props.statsType === "proposals" ? 
            finalArr.map(elm => Math.round((100*elm.value)/props.consultation.proposals_count))
          :
            finalArr.map(elm => Math.round((100*elm.value)/props.consultation.total_votes)),
          backgroundColor: PIE_COLORS,
          borderWidth: 1,
        },
      ],
    };
    setPieChartData(finalData);
    props.setIsLoading(false);
  }

  const options = {
    responsive: true, 
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: true,
        color: "white",
        font: { size: "16" },
        formatter: function (value) {
          if(value >= maxValue)
            return value + " %"
          else {
            return " ";
          }
        }
      },
      title: {
        display: true,
        font: { size: "16" },
        text: intl.formatMessage({ id: props.titleKey })
      },
      tooltip: {
        callbacks: {
          label: function(value) {
            return ` ${value.label}`;
          }
        }
      }
    }
  }

  return (
    !props.isLoading && (
      <div className={styles.pieChart}>
        <Pie data={pieChartData} plugins={[ChartDataLabels]} options={options} />
      </div>
    )
  )
}

export default withLoading(SynthesisPieChart);