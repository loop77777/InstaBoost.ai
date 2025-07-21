import React, { useState, useRef, useEffect } from 'react';
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
  PanResponder,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface VideoElement {
  id: string;
  type: 'text' | 'sticker' | 'music' | 'effect';
  content: string;
  position: { x: number; y: number };
  style: {
    fontSize?: number;
    color?: string;
    fontFamily?: string;
    rotation?: number;
    scale?: number;
  };
  timestamp: number; // When to show in video (seconds)
  duration: number; // How long to show (seconds)
}

interface VideoProject {
  id: string;
  title: string;
  duration: number; // Total video duration in seconds
  background: {
    type: 'color' | 'gradient' | 'video' | 'image';
    value: string;
  };
  elements: VideoElement[];
  audio?: {
    url: string;
    title: string;
    artist: string;
    volume: number;
  };
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
  };
}

const ReelEditor: React.FC = () => {
  const [project, setProject] = useState<VideoProject>({
    id: '1',
    title: 'My Reel',
    duration: 15,
    background: { type: 'color', value: '#E1306C' },
    elements: [],
    filters: { brightness: 0, contrast: 0, saturation: 0, blur: 0 }
  });

  const [selectedElement, setSelectedElement] = useState<VideoElement | null>(null);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [showEffectsModal, setShowEffectsModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newText, setNewText] = useState('');

  // Animation values for draggable elements
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: (pan.x as any)._value,
        y: (pan.y as any)._value,
      });
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: () => {
      pan.flattenOffset();
    },
  });

  const addTextElement = () => {
    if (!newText.trim()) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }

    const newElement: VideoElement = {
      id: Date.now().toString(),
      type: 'text',
      content: newText,
      position: { x: width / 2 - 50, y: height / 2 - 100 },
      style: {
        fontSize: 24,
        color: '#FFFFFF',
        fontFamily: 'Arial',
        rotation: 0,
        scale: 1,
      },
      timestamp: currentTime,
      duration: 3,
    };

    setProject(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));

    setNewText('');
    setShowTextModal(false);
  };

  const updateElementStyle = (elementId: string, styleUpdates: Partial<VideoElement['style']>) => {
    setProject(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === elementId 
          ? { ...el, style: { ...el.style, ...styleUpdates } }
          : el
      )
    }));
  };

  const deleteElement = (elementId: string) => {
    setProject(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId)
    }));
    setSelectedElement(null);
  };

  const duplicateElement = (element: VideoElement) => {
    const newElement: VideoElement = {
      ...element,
      id: Date.now().toString(),
      position: { x: element.position.x + 20, y: element.position.y + 20 }
    };

    setProject(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
  };

  const exportReel = () => {
    Alert.alert(
      'Export Reel',
      'Your reel is being processed! This feature will generate a video file with all your elements and effects.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export to Gallery', onPress: () => handleExport('gallery') },
        { text: 'Share to Instagram', onPress: () => handleExport('instagram') }
      ]
    );
  };

  const handleExport = (destination: 'gallery' | 'instagram') => {
    // In a real app, this would process the video
    Alert.alert('Success', `Reel exported to ${destination}!`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const backgroundOptions = [
    { type: 'color', value: '#E1306C', name: 'Instagram Pink' },
    { type: 'color', value: '#4267B2', name: 'Facebook Blue' },
    { type: 'color', value: '#FF6B35', name: 'Sunset Orange' },
    { type: 'gradient', value: 'linear-gradient(45deg, #E1306C, #F77737)', name: 'Instagram Gradient' },
    { type: 'gradient', value: 'linear-gradient(45deg, #667eea, #764ba2)', name: 'Purple Gradient' },
  ];

  const textFonts = ['Arial', 'Helvetica', 'Times', 'Courier', 'Impact', 'Comic Sans MS'];
  const textColors = ['#FFFFFF', '#000000', '#E1306C', '#FFD700', '#4CAF50', '#2196F3', '#FF5722'];

  const musicTracks = [
    { id: '1', title: 'Trending Beat 1', artist: 'AI Generated', duration: '0:30', popular: true },
    { id: '2', title: 'Viral Sound 2024', artist: 'TikTok Hit', duration: '0:15', popular: true },
    { id: '3', title: 'Chill Vibes', artist: 'Lofi Beats', duration: '1:00', popular: false },
    { id: '4', title: 'Upbeat Energy', artist: 'Pop Remix', duration: '0:45', popular: false },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{project.title}</Text>
        <TouchableOpacity onPress={exportReel}>
          <Ionicons name="download" size={24} color="#E1306C" />
        </TouchableOpacity>
      </View>

      {/* Canvas Area */}
      <View style={styles.canvas} {...panResponder.panHandlers}>
        <View style={[styles.videoPreview, { backgroundColor: project.background.value }]}>
          {/* Render video elements */}
          {project.elements.map(element => (
            <TouchableOpacity
              key={element.id}
              style={[
                styles.element,
                {
                  left: element.position.x,
                  top: element.position.y,
                  transform: [
                    { scale: element.style.scale || 1 },
                    { rotate: `${element.style.rotation || 0}deg` }
                  ]
                },
                selectedElement?.id === element.id && styles.selectedElement
              ]}
              onPress={() => setSelectedElement(element)}
            >
              {element.type === 'text' && (
                <Text style={[
                  styles.elementText,
                  {
                    fontSize: element.style.fontSize,
                    color: element.style.color,
                    fontFamily: element.style.fontFamily,
                  }
                ]}>
                  {element.content}
                </Text>
              )}
            </TouchableOpacity>
          ))}

          {/* Timeline indicator */}
          <View style={styles.timelineIndicator}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          </View>
        </View>
      </View>

      {/* Timeline */}
      <View style={styles.timeline}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.timelineTrack}>
            {Array.from({ length: project.duration }, (_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.timelineSegment,
                  currentTime === i && styles.activeSegment
                ]}
                onPress={() => setCurrentTime(i)}
              >
                <Text style={styles.segmentText}>{i + 1}s</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Playback Controls */}
      <View style={styles.playbackControls}>
        <TouchableOpacity onPress={() => setCurrentTime(Math.max(0, currentTime - 1))}>
          <Ionicons name="play-skip-back" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={32} 
            color="white" 
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setCurrentTime(Math.min(project.duration - 1, currentTime + 1))}>
          <Ionicons name="play-skip-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Tool Bar */}
      <View style={styles.toolbar}>
        <TouchableOpacity 
          style={styles.toolButton}
          onPress={() => setShowTextModal(true)}
        >
          <Ionicons name="text" size={20} color="#666" />
          <Text style={styles.toolText}>Text</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.toolButton}
          onPress={() => setShowMusicModal(true)}
        >
          <Ionicons name="musical-notes" size={20} color="#666" />
          <Text style={styles.toolText}>Music</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.toolButton}
          onPress={() => setShowEffectsModal(true)}
        >
          <Ionicons name="color-filter" size={20} color="#666" />
          <Text style={styles.toolText}>Effects</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolButton}>
          <Ionicons name="images" size={20} color="#666" />
          <Text style={styles.toolText}>Stickers</Text>
        </TouchableOpacity>
      </View>

      {/* Element Properties Panel */}
      {selectedElement && (
        <View style={styles.propertiesPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Edit {selectedElement.type}</Text>
            <TouchableOpacity onPress={() => setSelectedElement(null)}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {selectedElement.type === 'text' && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.textControls}>
                {/* Font Size */}
                <View style={styles.controlGroup}>
                  <Text style={styles.controlLabel}>Size</Text>
                  <View style={styles.sizeControls}>
                    <TouchableOpacity
                      onPress={() => updateElementStyle(selectedElement.id, { 
                        fontSize: Math.max(12, (selectedElement.style.fontSize || 24) - 2) 
                      })}
                    >
                      <Ionicons name="remove" size={16} color="#666" />
                    </TouchableOpacity>
                    <Text style={styles.sizeValue}>{selectedElement.style.fontSize || 24}</Text>
                    <TouchableOpacity
                      onPress={() => updateElementStyle(selectedElement.id, { 
                        fontSize: Math.min(72, (selectedElement.style.fontSize || 24) + 2) 
                      })}
                    >
                      <Ionicons name="add" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Colors */}
                <View style={styles.controlGroup}>
                  <Text style={styles.controlLabel}>Color</Text>
                  <View style={styles.colorPalette}>
                    {textColors.map(color => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorSwatch,
                          { backgroundColor: color },
                          selectedElement.style.color === color && styles.selectedColor
                        ]}
                        onPress={() => updateElementStyle(selectedElement.id, { color })}
                      />
                    ))}
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.controlGroup}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => duplicateElement(selectedElement)}
                  >
                    <Ionicons name="copy" size={16} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => deleteElement(selectedElement.id)}
                  >
                    <Ionicons name="trash" size={16} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      )}

      {/* Add Text Modal */}
      <Modal visible={showTextModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Text</Text>
              <TouchableOpacity onPress={() => setShowTextModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              value={newText}
              onChangeText={setNewText}
              placeholder="Enter your text..."
              multiline
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowTextModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={addTextElement}
              >
                <Text style={styles.addButtonText}>Add Text</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Music Modal */}
      <Modal visible={showMusicModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Music</Text>
              <TouchableOpacity onPress={() => setShowMusicModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.musicList}>
              {musicTracks.map(track => (
                <TouchableOpacity key={track.id} style={styles.musicItem}>
                  <View style={styles.musicInfo}>
                    <Text style={styles.musicTitle}>{track.title}</Text>
                    <Text style={styles.musicArtist}>{track.artist} • {track.duration}</Text>
                  </View>
                  {track.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>🔥</Text>
                    </View>
                  )}
                  <TouchableOpacity style={styles.addMusicButton}>
                    <Ionicons name="add" size={20} color="#E1306C" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  canvas: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  videoPreview: {
    flex: 1,
    aspectRatio: 9/16, // Instagram Reel aspect ratio
    position: 'relative',
  },
  element: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 4,
    padding: 4,
  },
  selectedElement: {
    borderColor: '#E1306C',
    borderStyle: 'dashed',
  },
  elementText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  timelineIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeline: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  timelineTrack: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  timelineSegment: {
    width: 40,
    height: 30,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSegment: {
    backgroundColor: '#E1306C',
  },
  segmentText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    gap: 30,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E1306C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    justifyContent: 'space-around',
  },
  toolButton: {
    alignItems: 'center',
    padding: 10,
  },
  toolText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  propertiesPanel: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 15,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  textControls: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 20,
  },
  controlGroup: {
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  sizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 10,
  },
  sizeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 20,
    textAlign: 'center',
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 8,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '70%',
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
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#E1306C',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  musicList: {
    maxHeight: 300,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  musicInfo: {
    flex: 1,
  },
  musicTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  musicArtist: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  popularBadge: {
    marginRight: 10,
  },
  popularText: {
    fontSize: 16,
  },
  addMusicButton: {
    padding: 8,
  },
});

export default ReelEditor;
