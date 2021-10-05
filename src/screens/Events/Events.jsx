import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Loading from '../../components/Loading';
import useFetchData from '../../hooks/useFetchData';

const Events = () => {
  const [events, setEvents] = useState([]);
  const { loading, fetchData, data } = useFetchData();

  useEffect(() => {
    if (events.length === 0) {
      fetchData('https://gateway.marvel.com:443/v1/public/events');
      if (data) {
        setEvents(data);
      }
    }
  }, [events, fetchData, data]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      {events.length !== 0 && console.log(events)}

      <div className='events'>
        {events.length !== 0 &&
          events.map((item) => (
            <div key={item.id} className='event'>
              <div className='thumbnail'>
                <img
                  src={`${item.thumbnail.path}.${item.thumbnail.extension}`}
                  alt={item.title}
                />
              </div>

              <div className='cover'>
                <h1 className='title'>{item.title}</h1>
              </div>
            </div>
          ))}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  margin-top: 25px;

  .events {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, auto));
    gap: 17px 15px;
  }

  .event {
    position: relative;
    overflow: hidden;
    transition: transform 0.5s ease;
    border-radius: 5px;

    .thumbnail {
      width: 227px;
      height: 300px;

      img {
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
    }

    .cover {
      position: absolute;
      bottom: 0;
      top: 0;
      width: 100%;
      background: rgba(0, 0, 0, 0.8);
      transform: translateY(94%) translateX(-21%) rotate(78deg);
      transition: all 0.45s ease;
      padding: 10px;

      .title {
        position: absolute;
        text-align: center;
        bottom: 0;
        left: 0;
        width: 100%;
        font-size: 0.87em;
        font-weight: 500;
        background-color: #aaa;
        color: #000000;
        padding: 5px 0;
      }
    }

    :hover {
      cursor: pointer;
      transform: scale(1.05) translateY(-5px);
    }

    :hover .cover {
      transform: translateY(0px) translateX(0px) rotate(0deg);
    }
  }
`;

export default Events;
