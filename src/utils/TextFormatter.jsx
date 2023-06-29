import { withConfig } from '@logora/debate.context.config_provider';
import { injectIntl } from 'react-intl';

export const formatText = (intl, config, id, variables = {}, count = 0) => {
  const formattedId = camelize(id);
    return (
      config.layout[formattedId] ?
        config.layout[formattedId]
      :
        (count && count > 1) ? 
          intl.formatMessage({ id: `${id}_plural` }, variables)
        :
          intl.formatMessage({ id: id }, variables)
    );
}

const camelize = (text) => {
  text = text.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
  return text.substr(0, 1).toLowerCase() + text.substr(1);
}

const TextFormatter = (props) => {
  return formatText(props.intl, props.config, props.id, props.variables, props.count);
}

export default injectIntl(withConfig(TextFormatter))