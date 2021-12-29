import Vue from 'vue'

import { DateTime, Settings, Duration, Interval} from 'luxon';

Settings.defaultLocale = 'utc';
DateTime.toLocaleString({ locale: "es" , ...DateTime.DATE_FULL });

Vue.prototype.DateTime = DateTime
Vue.prototype.Duration = Duration
Vue.prototype.Interval = Interval

