'use client';
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sphere, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

// Latitude/Longitude to 3D Sphere Coordinates Helper
// FIX: theta was (lng + 90) which put points on the wrong side of the
// globe relative to this texture's UV mapping — that's what made the
// flight arc go "ulta" (the long way around). Standard offset is +180.
const getCoordinates = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

const R = 2; // Earth Radius

// These two stay in sync on purpose — the heart mesh below counter-rotates
// by the exact same amount so it always faces the camera regardless of
// how the globe is tilted. If you tweak one, the heart adjusts automatically.
const GROUP_ROTATION_Y = -2.2; // Starting estimate — nudge in the browser until India & Morocco are both nicely on screen
const GROUP_ROTATION_X = 0.2;

// Classic heart silhouette built from bezier curves, extruded flat and centered.
function useHeartGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.25, y + 0.25);
    shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 2,
      curveSegments: 12,
    });
    geometry.center();
    // This bezier heart comes out upside-down when extruded — flip it
    // the right way up in its own plane.
    geometry.rotateZ(Math.PI);
    return geometry;
  }, []);
}

function FlightPathAndEarth() {
  const groupRef = useRef<THREE.Group>(null);
  const heartRef = useRef<THREE.Mesh>(null);
  const heartGeometry = useHeartGeometry();

  const earthMap = useLoader(THREE.TextureLoader, 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
  const cloudMap = useLoader(THREE.TextureLoader, 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png');

  // Dehradun to Casablanca exact coords
  const dehradunPos = useMemo(() => getCoordinates(30.3165, 78.0322, R * 1.02), []);
  const casablancaPos = useMemo(() => getCoordinates(33.5731, -7.5898, R * 1.02), []);

  const { curve, arcPoints } = useMemo(() => {
    const mid = dehradunPos.clone().lerp(casablancaPos, 0.5).normalize().multiplyScalar(R * 1.5);
    const bezierCurve = new THREE.QuadraticBezierCurve3(dehradunPos, mid, casablancaPos);
    return { curve: bezierCurve, arcPoints: bezierCurve.getPoints(50) };
  }, [dehradunPos, casablancaPos]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = GROUP_ROTATION_Y;
      groupRef.current.rotation.x = GROUP_ROTATION_X;
    }

    if (heartRef.current) {
      // India -> Morocco, same direction as before (this part was already correct)
      const flightProgress = (t * 0.2) % 1;
      const currentPos = curve.getPoint(flightProgress);
      heartRef.current.position.copy(currentPos);

      // Counter-rotate so the heart always faces the camera, no matter the globe's tilt
      heartRef.current.rotation.y = -GROUP_ROTATION_Y;
      heartRef.current.rotation.x = -GROUP_ROTATION_X;

      // Gentle heartbeat pulse
      const beat = 1 + 0.18 * Math.max(0, Math.sin(t * 3.2));
      heartRef.current.scale.setScalar(0.13 * beat);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Earth */}
      <Sphere args={[R, 64, 64]}>
        <meshStandardMaterial map={earthMap} roughness={0.8} />
      </Sphere>

      {/* Clouds Layer */}
      <Sphere args={[R * 1.01, 64, 64]}>
        <meshPhongMaterial map={cloudMap} transparent opacity={0.3} depthWrite={false} />
      </Sphere>

      {/* Atmosphere Glow */}
      <mesh scale={[R * 1.05, R * 1.05, R * 1.05]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>

      {/* The Arc Line - High and bright */}
      <Line
        points={arcPoints}
        color="#fbbf24"
        lineWidth={3}
        transparent
        opacity={0.8}
      />

      {/* Start Marker - Dehradun */}
      <mesh position={dehradunPos}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#fbbf24" emissiveIntensity={2} />
      </mesh>

      {/* End Marker - Casablanca */}
      <mesh position={casablancaPos}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#fbbf24" emissiveIntensity={2} />
      </mesh>

      {/* The Flying Heart, replaces the old golden dot */}
      <mesh ref={heartRef} geometry={heartGeometry}>
        <meshStandardMaterial
          color="#ff4d6d"
          emissive="#ff4d6d"
          emissiveIntensity={1.4}
          roughness={0.3}
        />
        {/* Soft glow halo behind it */}
        <mesh position={[0, 0, -0.05]} scale={2.2}>
          <circleGeometry args={[0.5, 24]} />
          <meshBasicMaterial color="#ff4d6d" transparent opacity={0.25} depthWrite={false} />
        </mesh>
      </mesh>
    </group>
  );
}

const CASABLANCA_LAT = 33.5731;
const CASABLANCA_LNG = -7.5898;

// Heart flight loops every 5s (t * 0.2 % 1 completes a cycle every 1/0.2 = 5s).
// This overlay is timed against that exact same period so the "landing"
// zoom appears right as the heart reaches Casablanca on the globe.
const CYCLE_DURATION = 5;

// Real OpenStreetMap tiles via Leaflet — no API key, and far more reliable
// than a single static-image service. The map itself stays fixed on
// Casablanca; the CSS scale on the wrapper below creates the "zooming in"
// cinematic feel.
function CasablancaMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [CASABLANCA_LAT, CASABLANCA_LNG],
        zoom: 13,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Custom divIcon avoids the classic Leaflet-in-webpack broken marker
      // icon path issue entirely.
      const pinIcon = L.divIcon({
        html: '<div style="font-size:28px;transform:translateY(-6px);">📍</div>',
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });
      L.marker([CASABLANCA_LAT, CASABLANCA_LNG], { icon: pinIcon }).addTo(map);

      mapInstanceRef.current = map;
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}

function LandingMapOverlay() {
  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{
        opacity: [0, 0, 1, 1, 0],
        scale: [0.3, 0.3, 1, 1, 1],
      }}
      transition={{
        duration: CYCLE_DURATION,
        repeat: Infinity,
        times: [0, 0.55, 0.65, 0.9, 1],
        ease: 'easeInOut',
      }}
    >
      <div className="relative w-[90%] h-[70%] md:w-[70%] md:h-[80%] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)] border border-white/10">
        <CasablancaMap />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Google-Maps-style label card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 0, 1, 1, 0], y: [10, 10, 0, 0, 10] }}
          transition={{
            duration: CYCLE_DURATION,
            repeat: Infinity,
            times: [0, 0.6, 0.7, 0.88, 1],
            ease: 'easeOut',
          }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 rounded-xl px-5 py-3 shadow-lg flex items-center gap-2 z-[1000]"
        >
          <span className="text-[#ff4d6d] text-lg">📍</span>
          <span className="text-[#030305] text-sm font-medium tracking-wide">Casablanca, Maroc</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function GoldenThread() {
  return (
    <div className="relative w-full h-[100dvh] bg-[#030305] flex flex-col items-center justify-center overflow-hidden z-10">

      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 3, 5]} intensity={2} color="#ffffff" />
          <directionalLight position={[-5, -3, -5]} intensity={1} color="#4f46e5" />

          <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
            <FlightPathAndEarth />
          </Float>
        </Canvas>
      </div>

      <LandingMapOverlay />

      <div className="z-10 absolute bottom-16 px-6 text-center w-full max-w-3xl flex flex-col items-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-light text-white/90 font-[family-name:var(--font-cormorant)] italic drop-shadow-lg">
            10 000 kilomètres...
          </h2>
          <p className="text-lg md:text-xl font-extralight text-white/80 tracking-wide drop-shadow-md">
            Mais nos cœurs battent exactement au même rythme.
          </p>
          <span className="block text-xs uppercase tracking-[0.3em] text-[#fbbf24]/90 mt-6 drop-shadow-md">
            Dehradun — Casablanca
          </span>
        </motion.div>
      </div>

    </div>
  );
}