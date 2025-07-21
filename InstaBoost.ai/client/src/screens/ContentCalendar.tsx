import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ContentItem {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  scheduled_time: Date;
  type: 'post' | 'reel' | 'story';
  status: 'draft' | 'scheduled' | 'published';
  media_url?: string;
  engagement_prediction?: number;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  content: ContentItem[];
}

const ContentCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [draggedContent, setDraggedContent] = useState<ContentItem | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [newContent, setNewContent] = useState<Partial<ContentItem>>({
    title: '',
    caption: '',
    hashtags: [],
    type: 'post',
    status: 'draft'
  });

  useEffect(() => {
    generateCalendarDays();
    loadContentItems();
  }, [currentDate]);

  const generateCalendarDays = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());
    
    const days: CalendarDay[] = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDay.getMonth() === currentDate.getMonth();
      const dayContent = contentItems.filter(item => 
        item.scheduled_time.toDateString() === currentDay.toDateString()
      );
      
      days.push({
        date: new Date(currentDay),
        isCurrentMonth,
        content: dayContent
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    setCalendarDays(days);
  };

  const loadContentItems = () => {
    // Simulate loading content from API
    const sampleContent: ContentItem[] = [
      {
        id: '1',
        title: 'Morning Motivation Post',
        caption: 'Start your day with positive energy! ✨',
        hashtags: ['#motivation', '#morningvibes', '#positivity'],
        scheduled_time: new Date(2025, 6, 25, 9, 0),
        type: 'post',
        status: 'scheduled',
        engagement_prediction: 85
      },
      {
        id: '2',
        title: 'Workout Reel',
        caption: 'Quick 5-minute workout routine 💪',
        hashtags: ['#workout', '#fitness', '#health'],
        scheduled_time: new Date(2025, 6, 26, 18, 0),
        type: 'reel',
        status: 'draft',
        engagement_prediction: 92
      },
      {
        id: '3',
        title: 'Behind the Scenes Story',
        caption: 'Day in my life content creation process',
        hashtags: ['#behindthescenes', '#contentcreator'],
        scheduled_time: new Date(2025, 6, 27, 12, 0),
        type: 'story',
        status: 'scheduled',
        engagement_prediction: 78
      }
    ];
    setContentItems(sampleContent);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleDatePress = (day: CalendarDay) => {
    setSelectedDate(day.date);
    if (day.content.length > 0) {
      setShowContentModal(true);
    }
  };

  const handleContentDrag = (content: ContentItem, targetDate: Date) => {
    const updatedContent = contentItems.map(item => 
      item.id === content.id 
        ? { ...item, scheduled_time: targetDate }
        : item
    );
    setContentItems(updatedContent);
    Alert.alert('Success', `Content moved to ${targetDate.toLocaleDateString()}`);
  };

  const createNewContent = () => {
    if (!newContent.title || !newContent.caption) {
      Alert.alert('Error', 'Please fill in title and caption');
      return;
    }

    const content: ContentItem = {
      id: Date.now().toString(),
      title: newContent.title!,
      caption: newContent.caption!,
      hashtags: newContent.hashtags || [],
      scheduled_time: selectedDate || new Date(),
      type: newContent.type as 'post' | 'reel' | 'story',
      status: 'draft',
      engagement_prediction: Math.floor(Math.random() * 40) + 60
    };

    setContentItems([...contentItems, content]);
    setNewContent({ title: '', caption: '', hashtags: [], type: 'post', status: 'draft' });
    setShowCreateModal(false);
    Alert.alert('Success', 'Content created successfully!');
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return 'image';
      case 'reel': return 'videocam';
      case 'story': return 'ellipse';
      default: return 'document';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#4CAF50';
      case 'scheduled': return '#FF9800';
      case 'draft': return '#9E9E9E';
      default: return '#2196F3';
    }
  };

  const renderCalendarDay = ({ item: day }: { item: CalendarDay }) => {
    const isToday = day.date.toDateString() === new Date().toDateString();
    const isSelected = selectedDate?.toDateString() === day.date.toDateString();
    
    return (
      <TouchableOpacity
        style={[
          styles.calendarDay,
          !day.isCurrentMonth && styles.otherMonth,
          isToday && styles.today,
          isSelected && styles.selectedDay,
        ]}
        onPress={() => handleDatePress(day)}
      >
        <Text style={[
          styles.dayNumber,
          !day.isCurrentMonth && styles.otherMonthText,
          isToday && styles.todayText
        ]}>
          {day.date.getDate()}
        </Text>
        
        {day.content.length > 0 && (
          <View style={styles.contentIndicators}>
            {day.content.slice(0, 3).map((content, index) => (
              <View
                key={content.id}
                style={[
                  styles.contentDot,
                  { backgroundColor: getStatusColor(content.status) }
                ]}
              />
            ))}
            {day.content.length > 3 && (
              <Text style={styles.moreIndicator}>+{day.content.length - 3}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderWeekHeader = () => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <View style={styles.weekHeader}>
        {weekdays.map(day => (
          <View key={day} style={styles.weekDay}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateMonth('prev')}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
        
        <TouchableOpacity onPress={() => navigateMonth('next')}>
          <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <View style={styles.calendar}>
        {renderWeekHeader()}
        <FlatList
          data={calendarDays}
          renderItem={renderCalendarDay}
          keyExtractor={(item) => item.date.toISOString()}
          numColumns={7}
          scrollEnabled={false}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.actionButtonText}>Create Content</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="calendar" size={20} color="white" />
          <Text style={styles.actionButtonText}>Bulk Schedule</Text>
        </TouchableOpacity>
      </View>

      {/* Content Details Modal */}
      <Modal visible={showContentModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Content for {selectedDate?.toLocaleDateString()}
              </Text>
              <TouchableOpacity onPress={() => setShowContentModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.contentList}>
              {selectedDate && contentItems
                .filter(item => item.scheduled_time.toDateString() === selectedDate.toDateString())
                .map(content => (
                  <View key={content.id} style={styles.contentItem}>
                    <View style={styles.contentHeader}>
                      <Ionicons 
                        name={getContentTypeIcon(content.type)} 
                        size={20} 
                        color="#666" 
                      />
                      <Text style={styles.contentTitle}>{content.title}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(content.status) }]}>
                        <Text style={styles.statusText}>{content.status}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.contentCaption}>{content.caption}</Text>
                    
                    <View style={styles.contentMeta}>
                      <Text style={styles.engagementPrediction}>
                        📈 {content.engagement_prediction}% predicted engagement
                      </Text>
                      <Text style={styles.scheduledTime}>
                        🕒 {content.scheduled_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Create Content Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Content</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.createForm}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Content Type</Text>
                <View style={styles.typeSelector}>
                  {['post', 'reel', 'story'].map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        newContent.type === type && styles.selectedType
                      ]}
                      onPress={() => setNewContent({ ...newContent, type: type as any })}
                    >
                      <Ionicons name={getContentTypeIcon(type)} size={16} color="#666" />
                      <Text style={styles.typeText}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={newContent.title}
                  onChangeText={(text) => setNewContent({ ...newContent, title: text })}
                  placeholder="Enter content title..."
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Caption</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newContent.caption}
                  onChangeText={(text) => setNewContent({ ...newContent, caption: text })}
                  placeholder="Write your caption..."
                  multiline
                  numberOfLines={4}
                />
              </View>
              
              <TouchableOpacity style={styles.createButton} onPress={createNewContent}>
                <Text style={styles.createButtonText}>Create Content</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  calendar: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  calendarDay: {
    width: width / 7 - 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  otherMonth: {
    opacity: 0.3,
  },
  today: {
    backgroundColor: '#E1306C',
  },
  selectedDay: {
    backgroundColor: '#2196F3',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  otherMonthText: {
    color: '#999',
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  contentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  moreIndicator: {
    fontSize: 8,
    color: '#666',
    marginLeft: 2,
  },
  actionBar: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1306C',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contentList: {
    maxHeight: 400,
  },
  contentItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  contentTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  contentCaption: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  contentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  engagementPrediction: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  scheduledTime: {
    fontSize: 12,
    color: '#666',
  },
  createForm: {
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    gap: 4,
  },
  selectedType: {
    backgroundColor: '#E1306C',
  },
  typeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#E1306C',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContentCalendar;
