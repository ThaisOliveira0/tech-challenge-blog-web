'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './GooeyNav.css';

interface GooeyNavItem {
  label: string;
  href: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
}

const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const [activeIndex, setActiveIndex] =
    useState(initialActiveIndex);

  const noise = (n = 1) =>
    n / 2 - Math.random() * n;

  const getXY = (
    distance: number,
    pointIndex: number,
    totalPoints: number
  ): [number, number] => {
    const angle =
      ((360 + noise(8)) / totalPoints) *
      pointIndex *
      (Math.PI / 180);

    return [
      distance * Math.cos(angle),
      distance * Math.sin(angle),
    ];
  };

  const createParticle = (
    i: number,
    t: number,
    d: [number, number],
    r: number
  ) => {
    const rotate = noise(r / 10);

    return {
      start: getXY(
        d[0],
        particleCount - i,
        particleCount
      ),

      end: getXY(
        d[1] + noise(7),
        particleCount - i,
        particleCount
      ),

      time: t,

      scale: 1 + noise(0.2),

      color:
        colors[
          Math.floor(
            Math.random() * colors.length
          )
        ],

      rotate:
        rotate > 0
          ? (rotate + r / 20) * 10
          : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (
    element: HTMLElement
  ) => {
    const d = particleDistances;
    const r = particleR;

    const bubbleTime =
      animationTime * 2 + timeVariance;

    element.style.setProperty(
      '--time',
      `${bubbleTime}ms`
    );

    for (
      let i = 0;
      i < particleCount;
      i++
    ) {
      const t =
        animationTime * 2 +
        noise(timeVariance * 2);

      const p = createParticle(
        i,
        t,
        d,
        r
      );

      element.classList.remove(
        'active'
      );

      setTimeout(() => {
        const particle =
          document.createElement('span');

        const point =
          document.createElement('span');

        particle.classList.add(
          'particle'
        );

        particle.style.setProperty(
          '--start-x',
          `${p.start[0]}px`
        );

        particle.style.setProperty(
          '--start-y',
          `${p.start[1]}px`
        );

        particle.style.setProperty(
          '--end-x',
          `${p.end[0]}px`
        );

        particle.style.setProperty(
          '--end-y',
          `${p.end[1]}px`
        );

        particle.style.setProperty(
          '--time',
          `${p.time}ms`
        );

        particle.style.setProperty(
          '--scale',
          `${p.scale}`
        );

        particle.style.setProperty(
          '--color',
          `var(--color-${p.color}, white)`
        );

        particle.style.setProperty(
          '--rotate',
          `${p.rotate}deg`
        );

        point.classList.add(
          'point'
        );

        particle.appendChild(point);
        element.appendChild(particle);

        requestAnimationFrame(() => {
          element.classList.add(
            'active'
          );
        });

        setTimeout(() => {
          particle.remove();
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (
    element: HTMLElement
  ) => {
    if (
      !containerRef.current ||
      !filterRef.current ||
      !textRef.current
    ) {
      return;
    }

    const containerRect =
      containerRef.current.getBoundingClientRect();

    const pos =
      element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };

    Object.assign(
      filterRef.current.style,
      styles
    );

    Object.assign(
      textRef.current.style,
      styles
    );

    textRef.current.innerText =
      element.innerText;
  };

  const animateTo = (
    index: number
  ) => {
    if (
      !navRef.current ||
      !filterRef.current ||
      !textRef.current
    ) {
      return;
    }

    const liEl =
      navRef.current.querySelectorAll(
        'li'
      )[index] as HTMLElement;

    if (!liEl) return;

    setActiveIndex(index);

    updateEffectPosition(liEl);

    const particles =
      filterRef.current.querySelectorAll(
        '.particle'
      );

    particles.forEach((particle) =>
      particle.remove()
    );

    textRef.current.classList.remove(
      'active'
    );

    void textRef.current.offsetWidth;

    textRef.current.classList.add(
      'active'
    );

    makeParticles(
      filterRef.current
    );
  };

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number
  ) => {
    e.preventDefault();

    if (activeIndex !== index) {
      animateTo(index);
    }

    router.push(items[index].href);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLAnchorElement>,
    index: number
  ) => {
    if (
      e.key === 'Enter' ||
      e.key === ' '
    ) {
      e.preventDefault();

      if (activeIndex !== index) {
        animateTo(index);
      }

      router.push(items[index].href);
    }
  };


  useEffect(() => {
    const index = items.findIndex(
      (item) => item.href === pathname
    );

    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [pathname, items]);


  useEffect(() => {
    if (
      !navRef.current ||
      !containerRef.current
    ) {
      return;
    }

    const activeLi =
      navRef.current.querySelectorAll(
        'li'
      )[activeIndex] as HTMLElement;

    if (activeLi) {
      updateEffectPosition(activeLi);

      textRef.current?.classList.add(
        'active'
      );
    }

    const resizeObserver =
      new ResizeObserver(() => {
        const currentActiveLi =
          navRef.current?.querySelectorAll(
            'li'
          )[activeIndex] as HTMLElement;

        if (currentActiveLi) {
          updateEffectPosition(
            currentActiveLi
          );
        }
      });

    resizeObserver.observe(
      containerRef.current
    );

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeIndex]);

  return (
    <div
      className="gooey-nav-container"
      ref={containerRef}
    >
      <nav>
        <ul ref={navRef}>
          {items.map(
            (item, index) => (
              <li
                key={item.href}
                className={
                  activeIndex === index
                    ? 'active'
                    : ''
                }
              >
                <a
                  href={item.href}
                  onClick={(e) =>
                    handleClick(
                      e,
                      index
                    )
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      index
                    )
                  }
                >
                  {item.label}
                </a>
              </li>
            )
          )}
        </ul>
      </nav>

      <span
        className="effect filter"
        ref={filterRef}
      />

      <span
        className="effect text"
        ref={textRef}
      />
    </div>
  );
};

export default GooeyNav;