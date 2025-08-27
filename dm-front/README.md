# [DM-FRONTEND] Starting Guide

---

### General Info

The project is bootstrapped with create-next-app `yarn create next-app --typescript`

There are three git hooks, that should run on each commit:

- `pre-commit` it runs lint-staged
- `commit-msg` it lints the commit message (commit message should always have the jira ticket number)
- `prepare-commit-msg` it adds the JIRA ticket number, if the branch name is of the format `feat/{jiraTicketNumber}`

If commit is required to be made without running the git hooks, please use the `--no-verify` flag while adding the commit message to disable the hooks
❗**Important:** Do not open pull requests with `--no-verify`, it is there for extreme cases.

The hooks are tested on macOS

### Development Process

Keeping things the same across all teams, the development process has the following steps:

- Branch out from `master`
- Name the branch as `feat/{jiraTicketNumber}`
- Create PR against `master`
- Give the task for code review
- Post approval the feature branch is automatically built (deploy status can be checked here: [#feature-branch-deployment-notifications](https://soumtalk.slack.com/archives/C03KTBD9V55)
- Move the task to ready for qa
- Fix the bugs as revealed during testing
- After successful testing and subsequent code reviews after bug fixes merge the task into master
- For releasing the task to production create the next version tag and push it to the repo

❗ **Important:** Please do not keep dangling branches in the repository, if a feature branch is merged in the master it should be deleted.

❗**Important:** Please do a self-review before opening the PR, please try to submit the PR with the change that are required for a particular task. Please remove debuggers, console.logs before submitting the PR. Please run `yarn build` and check that the app is successfully being built locally, so as to avoid later issues with automatic deploy

### Environment Variables

Since the project is bootstrapped with next-app we have three .env files

- `.env.local` It is only concerned with developing locally and so is in `.gitignore`
- `.env.production` This is used when running the command `yarn build`
- `.env.development` It is used for building staging / feature builts and is used when
  running the command `build:develop`

Development Guidelines

**Import Order**

The project follows a strict import order as follows:

- Top most imports are reserved for third parties dependencies, aka those installed via yarn in node_modules
- Next comes absolute imports of any self-written modules/files that the current modules depends on.
- Last comes dependencies/files/modules that are situated in the same folder and which will be only used in conjunction with the current module. For ex. utils/helpers for the current module.


❗Important: Every level should be separated by a space / new line

Example:

```jsx
import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';
import css from '@styled-system/css';
import Select, { SingleValue } from 'react-select';
import deepmerge from 'deepmerge';
import { formatDistanceToNow } from 'date-fns';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { isValidIBAN } from 'ibantools';
import { useMutation } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { Bank } from '@/models/Bank';
import { Loader } from '@/components/Loader';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { FormField, Input } from '@/components/Form';
import { CommonModal } from '@/components/Modal';
import { Text } from '@/components/Text';
import { Stack } from '@/components/Layouts';
import { styles } from '@/components/Shared/commonSelectStyles';
import { BuyerOrderDetails, IPaymentMethod } from '@/models/OrderDetails';
import { BuyerRefundDTO } from '@/types/dto';
import { textTypes } from '@/types/index';

import { useBuyerRefunds } from './hooks/useBuyerRefunds';
import { useBuyerOrderDetails } from './hooks/useBuyerOrderDetails';
import { BankSelect } from './BankSelect';
import { PaymentHistoryTable } from './PaymentHistoryTable';
```

**The project tries to work in a constraint based setup.**

**Component Creations**

- It means that creating any new component from scratch is done only in extreme circumstances. Maximum re-use of previously created solutions should be done.
- New components should find a common re-usable pattern that might occur from time to time and design it in such a way that it can be reused in other contexts
- Layout should be done using components kept in the `src/components/Layouts` folder. At the moment, we have only one `Stack` component, more can be added when the needs arise.
  For layout inspirations, please check [Every Layout](https://www.notion.so/Every-Layout-083ddeb271e7407dbcbaa833d2273ad3?pvs=21) and / or [https://csslayout.io/](https://csslayout.io/)

**Styled System**

We are trying to implement a design system. To achieve this we use `styled-components` along with `styled-system` More information about them can be found here [Styled Components](https://styled-components.com/) and [Styled System](https://styled-system.com/)

As stated above, we try to work in constraint based setup, for doing so all the style tokens pertaining to `typography` , `spacing`, `size`, `radiuses`, `shadows` and `z indices` are declared at a singe place. The current values should suffice for all the UI development needs. If any value needs to be introduced it should be done in the corresponding fields of the theme.

For a little background, do check the talk:

[https://www.youtube.com/watch?v=Dd-Y9K7IKmk](https://www.youtube.com/watch?v=Dd-Y9K7IKmk)

**State Management**

We are not using any kind of global state management library and we will be trying to avoid it as much as possible. At the moment, the only two global states that the app is dependent on are saved and read from cookies, they are authorization token and information about currently signed in user.

Any state should be as much as local to the component.

Our approach is to use specific state management libraries which caters to specific needs.

- Fetching needs ⇒ `tanstack-query`
- Table ⇒ `tanstack-table`
- Form state management ⇒ `react-hook-form`
- Notification state management ⇒ `react-hot-toast`
- Custom select ⇒ `react-select`
- Modal / Dialogs etc ⇒ `styled-react-modal`

### Prerequisites

node version **> 16.14.0**
yarn **> 1.22.17 < 1.xx.xx**
typescript **4.7.4**
next **12.3**

### Bootstrapping Development

1. SSH clone
   `git clone [git@gitlab.com](mailto:git@gitlab.com):soum01/dm-front.git`
   HTTPS clone
   `git clone [https://gitlab.com/soum01/dm-front.git](https://gitlab.com/soum01/dm-front.git)`
2. `yarn`
3. create `.env.local` from `.env.example` and fill the values
4. `yarn dev`

### Resources

next.js documentation: [https://nextjs.org/docs/getting-started](https://nextjs.org/docs/getting-started)
next.js app wide layouts: [https://nextjs.org/docs/basic-features/layouts](https://nextjs.org/docs/basic-features/layouts)
tanstack-query documentation: [https://tanstack.com/query/v4/docs/overview](https://tanstack.com/query/v4/docs/overview)
tanstack-table documentation: [https://tanstack.com/table/v8/docs/guide/introduction](https://tanstack.com/table/v8/docs/guide/introduction)
react-hook-form documentation: [https://react-hook-form.com/get-started](https://react-hook-form.com/get-started)
react-hot-toast documentation: [https://react-hot-toast.com/docs](https://react-hot-toast.com/docs)
react-select documentation: [https://react-select.com](https://react-select.com/home)
styled-react-modal: [https://github.com/AlexanderRichey/styled-react-modal](https://github.com/AlexanderRichey/styled-react-modal)
