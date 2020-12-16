import React from 'react'
import { Link } from 'react-router'
import t from 't-component'
import Vote from 'lib/frontend/site/topic-layout/topic-article/vote/component'
import Poll from 'lib/frontend/site/topic-layout/topic-article/poll/component'
import Cause from 'lib/frontend/site/topic-layout/topic-article/cause/component'
import Slider from 'lib/frontend/site/topic-layout/topic-article/slider/component'
import Hierarchy from 'lib/frontend/site/topic-layout/topic-article/hierarchy/component'

const text = (method) => {
  switch (method) {
    case 'cause':
      return 'Brinde su apoyo a la iniciativa'
    case 'slider':
      return 'Deslice hacia el lado que se inclina más hacia su opinión'
    case 'hierarchy':
      return 'Puede organizar o arrastrar las opciones en el orden que más se ajuste a tus prioridades'
    case 'vote':
      return 'Elige la opción que más se ajusta a tu posición'
    case 'poll':
      return 'Elige la opción que más se ajusta a tu posición'
    default:
      return 'Elige la opción que más se ajusta a tu posición'
  }
}

export default ({ topic, userAttrs }) => (
  <div className='topic-article-content topic-article-action'>
    {topic.attrs && topic.attrs.pregunta &&
      <h3 className='topic-action-title'>{topic.attrs.pregunta}</h3>
    }
  
    {!topic.closed && !topic.voted && userAttrs &&
      <p className='topic-action-explain'>{text(topic.action.method)}</p>
    }
    {!topic.closed && topic.voted && topic.action.method === 'poll' &&
      <div className='alert alert-info alert-poll' role='alert'>
        <span className='icon-info bold' />
        <span className='black bold thanks'>{t('topics.actions.thanks')}</span>
        <span className='black'>{t('topics.actions.feedback')}</span>
      </div>
    }
    {(() => {
      switch(topic.action.method) {
        case 'vote':
          return  <Vote topic={topic} positiveColor='#0695d6' neutralColor='#666666' negativeColor='#7b548a' />
        case 'poll':
          return  <Poll topic={topic} />
        case 'cause':
          return <Cause topic={topic} />
        case 'slider':
          return <Slider topic={topic} />
        case 'hierarchy':
          return <Hierarchy topic={topic} />
        }
    })()}
    {topic.voted && !topic.closed &&
      <div className='voted-results-exp'>
        Tan pronto cierre la consulta podrás visualizar los resultados.
      </div>
    }
    {topic.closed &&
      <div>
        {topic.action.method == 'cause' ?
         (  <div className='action-count'>
            <span className='number'>{topic.action.count}</span>
            <span>{topic.action.count === 1 ? 'participante brindó' : 'participantes brindaron'} su apoyo.</span>
            </div>  )  : ( 
          <div className='action-count'>
            <div className='participantes' />
            <span className='number'>{topic.action.count}</span>
            <span>{topic.action.count === 1 ? 'participante' : 'participantes'}</span>
          </div> )
         }
        <Link to='/'>
          <button className='btn btn-primary'>
            Participar en otra consulta
          </button>
        </Link>
      </div>
    }
  </div>
)
