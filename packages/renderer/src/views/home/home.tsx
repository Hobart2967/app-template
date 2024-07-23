import './home.scss';

import { useDependency } from '../../contexts/dependency-injection.context';
import { TimeService } from '../../services/time.service';
import { createFromObservable } from '../../tools/from-observable';

export default function Home() {
  const userService: TimeService = useDependency(TimeService);
  const [user] = createFromObservable(userService.user);
  return (<>
    <header class="g-8">
      Current time is {user().toISOString()}
    </header>
  </>);
}
