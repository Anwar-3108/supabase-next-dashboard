"use client";

import { useState, useEffect, useRef } from "react";
import { MdNotifications } from "react-icons/md";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function Notifications({ initialNotifications, isLoading ,notifications }) {
  const [notificationsState, setNotificationsState] = useState(initialNotifications || []);
  const [loadingState, setLoadingState] = useState(isLoading || true);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [viewedNotifications, setViewedNotifications] = useState(new Set()); 
  const observerRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();
        if (Array.isArray(data?.data)) {
          setNotificationsState(data?.data);
        } else {
          console.error("Invalid data format:", data);
          setNotificationsState([]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotificationsState([]);
      } finally {
        setLoadingState(false);
      }
    };

    fetchNotifications();
  }, [notifications]);

  const unreadCount = notificationsState.filter((n) => !n.is_read).length;

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true }),
      });

      if (response.ok) {
        setNotificationsState((prev) =>
          prev.map((n) =>
            n.id === Number(notificationId) ? { ...n, is_read: true } : n
          )
        );
      } else {
        console.error("Failed to update notification:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  
  useEffect(() => {
    if (!popoverVisible) {
     
      viewedNotifications.forEach((notificationId) => {
        markAsRead(notificationId);
      });
      setViewedNotifications(new Set()); 
    }
  }, [popoverVisible]); 

  const handlePopoverClose = () => {
    setPopoverVisible(false);
  };


  useEffect(() => {
    if (popoverVisible) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const notificationId = entry.target.getAttribute("data-id");
            if (notificationId && !viewedNotifications.has(notificationId)) {
             
              setViewedNotifications((prev) => new Set(prev.add(notificationId)));
            }
          }
        });
      }, { threshold: 0.5 });

      setTimeout(() => {
        document.querySelectorAll(".notification-item").forEach((el) => {
          if (observerRef.current) {
            observerRef.current.observe(el);
          }
        });
      }, 500);

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [popoverVisible, viewedNotifications]); 

  const unreadNotifications = notificationsState.filter((n) => !n.is_read);

  return (
    <Popover onOpenChange={(open) => setPopoverVisible(open)}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <MdNotifications className="text-cyan-500 text-2xl" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 border-2 border-cyan-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 bg-gray-900 text-white p-2 rounded-lg shadow-lg border border-gray-700"
        onClose={handlePopoverClose}
      >
        <h4 className="text-sm font-semibold mb-2">Notifications</h4>
        <div className="space-y-2 max-h-48 overflow-auto">
          {loadingState ? (
            <p className="text-xs text-gray-400">Loading notifications...</p>
          ) : unreadNotifications.length > 0 ? (
            unreadNotifications.map((notification) => (
              <div
                key={notification.id}
                data-id={notification.id}
                className={`notification-item p-2 text-sm rounded-md ${
                  notification.is_read ? "bg-gray-700 text-gray-400" : "bg-gray-800"
                }`}
              >
                {notification.message}
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400">No new notifications</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
