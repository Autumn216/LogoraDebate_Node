export default function deepMerge(target, source) {
    for (let k in source) {
        let vs = source[k], vt = target[k];
        if (Object(vs) == vs && Object(vt) === vt) {
            target[k] = deepMerge(vt, vs)
            continue
        }
        target[k] = source[k]
    }
    return target;
}