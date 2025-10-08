import AppsIcon from 'assets/dualicons/applications.svg?react'
// import ChatIcon from 'assets/nav-icons/chat.svg?react'
// import KanbanIcon from 'assets/nav-icons/kanban.svg?react'
// import MailIcon from 'assets/nav-icons/mail.svg?react'
// import CheckDoubleIcon from 'assets/nav-icons/check-double.svg?react'
// import Nft1Icon from 'assets/nav-icons/nft-1.svg?react'
// import Nft2Icon from 'assets/nav-icons/nft-2.svg?react'
import CloudIcon from 'assets/nav-icons/cloud.svg?react'
// import BotIcon from 'assets/nav-icons/bot.svg?react'
import MoneyIcon from 'assets/nav-icons/money.svg?react'
// import PinIcon from 'assets/nav-icons/pin.svg?react'
// import { NAV_TYPE_ROOT, NAV_TYPE_ITEM, NAV_TYPE_DIVIDER } from 'constants/app.constant'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'
import { MdPointOfSale } from "react-icons/md";


const ROOT_APPS = '/apps'

const path = (root, item) => `${root}${item}`;

export const apps = {
    id: 'apps',
    type: NAV_TYPE_ROOT,
    path: '/apps',
    title: 'Applications',
    transKey: 'nav.apps.apps',
    Icon: AppsIcon,
    childs: [




        // {
        //     id: 'apps.divide-1',
        //     type: NAV_TYPE_DIVIDER
        // },

        {
            id: 'apps.filemanager',
            path: path(ROOT_APPS, '/filemanager'),
            type: NAV_TYPE_ITEM,
            title: 'File Manager',
            transKey: 'nav.apps.filemanager',
            Icon: CloudIcon,
        },
        {
            id: 'apps.pos',
            path: path(ROOT_APPS, '/lib'),
            type: NAV_TYPE_ITEM,
            title: 'POS Sytem',
            transKey: 'nav.apps.library',
            Icon: MdPointOfSale,
        },
         {
            id: 'apps.pos',
            path: path(ROOT_APPS, '/pos'),
            type: NAV_TYPE_ITEM,
            title: 'library',
            transKey: 'nav.apps.pos',
            Icon: MoneyIcon,
        },

    ]
}
