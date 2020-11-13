/**
 *
 * Asynchronously loads the component for Task
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
