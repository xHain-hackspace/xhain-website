package calendar

import (
	"sync"
	"time"
)

type CalendarCache struct {
	data      []CalendarEvent
	lastFetch time.Time
	ttl       time.Duration
	mu        sync.RWMutex
}

func (cc *CalendarCache) getCachedEvents() ([]CalendarEvent, bool) {
	cc.mu.RLock()
	defer cc.mu.RUnlock()

	if cc.data == nil {
		return nil, false
	}

	if time.Since(cc.lastFetch) > cc.ttl {
		return nil, false
	}

	return cc.data, true
}

func (cc *CalendarCache) setCachedEvents(data []CalendarEvent) {
	cc.mu.Lock()
	defer cc.mu.Unlock()

	cc.data = data
	cc.lastFetch = time.Now()
}
