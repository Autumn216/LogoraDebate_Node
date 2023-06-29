import { useIntl } from 'react-intl';

export const useRelativeTime = (time) => {
    const intl = useIntl();
    const now = new Date().getTime();
    const diff = Math.abs(time - now);
    const mark = (time - now) > 0 ? 1 : -1;

    const times = [
        { type: 'second', seconds: 1000, segments: 60 },
        { type: 'minute', seconds: 60 * 1000, segments: 60 },
        { type: 'hour', seconds: 60 * 60 * 1000, segments: 24 },
        { type: 'day', seconds: 24 * 60 * 60 * 1000, segments: 30 },
        { type: 'month', seconds: 30 * 24 * 60 * 60 * 1000, segments: 12 },
        { type: 'year', seconds: 12 * 30 * 24 * 60 * 60 * 1000, segments: 1000 },
    ];

    let params = [];
    for (let t of times) {
        const segment = Math.round(diff / t.seconds);
        if (segment >= 0 && segment < t.segments) {
            params = [(segment * mark) | 0, t.type];
            break;
        }
    }

    if(params[0] <= 0) {
        return intl.formatMessage({ id: `relative_time.past.${params[1]}`, defaultMessage: "1 month ago"}, { time: Math.abs(params[0]) });
    } else {
        return intl.formatMessage({ id: `relative_time.future.${params[1]}`, defaultMessage: "1 month ago"}, { time: Math.abs(params[0]) });
    }
}