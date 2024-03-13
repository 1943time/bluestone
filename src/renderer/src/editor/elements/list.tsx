import {ElementProps, ListItemNode, ListNode} from '../../el'
import React, {createElement, useMemo, useRef} from 'react'
import {useMEditor} from '../../hooks/editor'
import {Checkbox} from 'antd'
import {useEditorStore} from '../store'
import {observer} from 'mobx-react-lite'
import Drag from '../../icons/Drag'
import {configStore} from '../../store/config'
import {getVisibleStyle, useMonitorHeight} from '../plugins/elHeight'

export const List = observer(({element, attributes, children}: ElementProps<ListNode>) => {
  const store = useEditorStore()
  useMonitorHeight(store, element)
  return useMemo(() => {
    const tag = element.order ? 'ol' : 'ul'
    return (
      <div
        className={'relative'}
        style={{...getVisibleStyle(element)}}
        data-be={'list'}
        {...attributes}
        onDragStart={store.dragStart}
      >
        {createElement(tag, {className: 'm-list', start: element.start, ['data-task']: element.task ? 'true' : undefined}, children)}
      </div>
    )
  }, [element.task, element.order, element.start, element.children, configStore.config.dragToSort])
})

export const ListItem = observer(({element, children, attributes}: ElementProps<ListItemNode>) => {
  const [, update] = useMEditor(element)
  const store = useEditorStore()
  const isTask = typeof element.checked === 'boolean'
  return useMemo(() => (
    <li
      className={`m-list-item ${isTask ? 'task' : ''}`}
      data-be={'list-item'}
      onDragStart={e => store.dragStart(e)}
      {...attributes}>
      {isTask &&
        <span contentEditable={false} className={'check-item'}>
          <Checkbox
            checked={element.checked}
            onChange={e => update({checked: e.target.checked})}
          />
        </span>
      }
      {children}
    </li>
  ), [element, element.children, store.refreshHighlight])
})
